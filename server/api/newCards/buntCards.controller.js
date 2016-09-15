'use strict';
var fs = require("fs");
var XLSX = require('xlsx');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

  var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
  //var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  //    process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_DIR = "credentials\\";
  var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

  var buntFolder = '0B-SU-eAGCKuiOXB0ZXB3RkZmSXM'; // Bunt top directory
  var huddleFolder = '0B-SU-eAGCKuiUjNJYWgwMk1FaGM'; // Huddle top directory

function dateForQuery (dt) {
   var mnth = dt.getMonth();
   mnth++;
   if(mnth < 10) mnth = "0" + mnth;

   var day = dt.getDate();
   if(day < 10) day="0" + day;
   var yr = dt.getFullYear();

   var hrs = dt.getHours();
   if (hrs < 10) hrs = "0" + hrs;

   var min = dt.getMinutes();
   if (min < 10) min = "0" + min;

   var secs = dt.getSeconds();
   if (secs < 10) secs = "0" + secs;

   return yr + "-" + mnth + "-" + day + "T" + hrs + ":"  + min + ":" + secs;
}

export function getIds(req, res) {
  console.log("In getIds");

  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return res.status(502).send('Error loading client secret file: ' + err);
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), processRecent, req, res);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, req, res) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      res.status(503).send("Not authorized to read Google Drive (no token)");
      //getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, req, res);
    }
  });
}

function processRecent(auth, req, res) {
  var sinceDate,
      service = google.drive('v3');

  // Attempt to pull sinceDate from request
  if(req.query.since) {
    var dtstr = req.query.since.replace(/\D/g, " ");
    var dtcomps = dtstr.split(" ");
    dtcomps[1]--;
    sinceDate = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
  } else {
    sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);
  }
   //console.log("Query is: <<" +  "modifiedTime > '" + dateForQuery(sinceDate) + "' and mimeType contains 'image/'");
  service.files.list({
    auth: auth,
    pageSize: 900,
    q: "modifiedTime > '" + dateForQuery(sinceDate) + "' and mimeType contains 'image/'",
    //q: "modifiedTime > '2016-07-30T12:00:00' and mimeType contains 'image/'",
    fields: "nextPageToken, files(id, name, mimeType)"
  }, function(err, response) {
    if (err) {

      // Need exponential backoff because we're calling the API too fast

      console.log('The API returned an error: ' + err);
      return res.status(502).send("Request to Google Drive returned " + err);
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
      return res.status(502).send("Request to Google Drive returned no recent files");
    } else {

      var newList = [];

      //console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
      // console.log('%s (%s):%s', file.name, file.id);
        var newSet = {
          "name": file.name,
          "id": file.id
        };
        newList.push(newSet);
      }

      if (newList.length) {
        //console.log("****WE ARE GOOD****" + JSON.stringify(newList));
        res.status(200).json(newList);

      } else {
        console.log('No files found.');
        return res.status(502).send("Request to Google Drive returned no recent files");
      }

    }
  });
}

export function index(req, res) {
  res.redirect(303, '/bunt.json');
}

export function update(req, res) {

  // replicates functionality of DH_scripts/parse_bunt_excel.js

  function parse_bunt_excel() {
    var ch_path = "./";
    var workbook = XLSX.readFile(ch_path + 'buntseries2.xlsx');
    var jsonOut = s_path + "bunt.json";
    var idSheets = {
      "ID Table": 1,
      "2016 Inserts": 1,
      "2016 Huddle" : 1,
      "Insert Old ID Table": 1
    };

    var chachi_db = [];

    function saveSet(theSet) {
      if (theSet.cards.length) {
        chachi_db.push(theSet);
      }
    }

    for (var ws_num = 0; ws_num < workbook.SheetNames.length; ws_num++) {
      // Each sheet represents a year/set
      var sheet_name = workbook.SheetNames[ws_num];
  //    console.log("Sheet = " + sheet_name);

      if (idSheets[sheet_name]) {
//        console.log("Sheet OK = " + sheet_name);
        var worksheet = workbook.Sheets[sheet_name];
        var chachi_set = {
          "year": sheet_name,
          "cards": []
        };

        // Parse through rows
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
        roa.forEach(function(row) {
          //console.log("In Row, name = " + row.name);
          if (row.name) { // Skip rows with no name
            if (row.id) {
              if (row.id.match(/^No/)) {
                //console.log("ID is No: " + row.id);
                // Could put a default image here
              } else {

                // Skip any rows without a url
                //console.log("name : " + row.name);
                //console.log("id : " + row.id);
                var card = {
                  "name": row.name,
                  "id": row.id
                };
                chachi_set.cards.push(card);

              }
            } else {
              // Name but no ID indicates start of new set

              saveSet(chachi_set);
              chachi_set = {
                "year": row.name,
                "cards": []
              };
            }

          }

        });
        // Save last set on sheet
        saveSet(chachi_set);

      }
    }
    console.log("Finished conversion at " + new Date());
    return chachi_db;
  }
  console.log("Starting excel procoessing at " + new Date());
  var s_path = "server/public/";
  try {
    fs.writeFileSync(s_path + 'bunt.json',
      JSON.stringify(parse_bunt_excel()));

  } catch (e) {
    console.log("Caught exception parsing and writing - " + e);

  }


  res.redirect(303, '/bunt.json');
}
