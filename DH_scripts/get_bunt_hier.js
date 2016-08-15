var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var util = require('util');
var events = require('events');


function DirWorker() {
   this.instanceCnt = 0;
   events.EventEmitter.call(this);
}

util.inherits(DirWorker, events.EventEmitter);
var dirWorker = new DirWorker();

dirWorker.on('process', function(dirFile) {
   this.instanceCnt++;

   setTimeout(function() {
      processDir(theAuth, dirFile.id, dirFile.name);
   }, 1000 * this.instanceCnt);

});

var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
//var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_DIR = "credentials\\";
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

var buntFolder = '0B-SU-eAGCKuiOXB0ZXB3RkZmSXM';  // Bunt top directory
var huddleFolder = '0B-SU-eAGCKuiUjNJYWgwMk1FaGM';  // Huddle top directory

var cardDb = [];
var theAuth = "";





// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function processRecent(auth, sinceDate) {
  var service = google.drive('v3');
  //console.log("Processing " + dirName);
  service.files.list({
    auth: auth,
    pageSize: 900,
//    q: "modifiedTime > '" + sinceDate + "' and mimeType contains 'image/'",
    q: "modifiedTime > '2016-07-30T12:00:00' and mimeType contains 'image/'",
    fields: "nextPageToken, files(id, name, mimeType)"
  }, function(err, response) {
    if (err) {

      // Need exponential backoff because we're calling the API too fast

      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      //console.log('No files found.');
    } else {

      var newList = {
         "cards" : []
      };

      //console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
            // console.log('%s (%s):%s', file.name, file.id);
            var newSet = {
              "name" : file.name,
              "id"   : file.id
            };
            newList.cards.push(newSet);
      }

      if (newList.cards.length) {
//      	 cardDb.push(newList);
      	 var dbString = JSON.stringify(newList)
      	 //var dbString = angular.toJson(cardDb)
	 console.log(dbString + ",");
	 // How to get newList out to express and the client ?

      }

    }
  });
}

function processDir(auth, dirId, dirName) {
  var service = google.drive('v3');
  //console.log("Processing " + dirName);
  service.files.list({
    auth: auth,
    pageSize: 900,
    q: "'" + dirId + "' in parents",
    fields: "nextPageToken, files(id, name, mimeType)"
  }, function(err, response) {
    if (err) {

      // Need exponential backoff because we're calling the API too fast

      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      //console.log('No files found.');
    } else {

      var newList = {
         "year" : dirName,
         "id"   : dirId,
         "cards" : []
      };

      //console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
    	if (file.mimeType == 'application/vnd.google-apps.folder') {
    	  //dirIds.push(file);
    	  dirWorker.emit('process', file);
    	} else {
            // console.log('%s (%s):%s', file.name, file.id);
            var newSet = {
              "name" : file.name,
              "id"   : file.id
            };
            newList.cards.push(newSet);
        }
      }

      if (newList.cards.length) {
      	 cardDb.push(newList);
      	 var dbString = JSON.stringify(newList)
      	 //var dbString = angular.toJson(cardDb)
	 console.log(dbString + ",");

      }

    }
  });
}

/**
 * Lists the names and IDs of up to 900 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  theAuth = auth;
  //processDir(auth, buntFolder, 'Bunt Root');
  //processDir(auth, huddleFolder, 'Huddle Root');
  processRecent(auth);
}

/**
 * To Dos
 *
 * 1.  Write out json file when done processing all directories
 *
 * 2.  Only update json with new and/or modified files and directories
 */
