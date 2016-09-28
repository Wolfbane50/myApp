var fs = require("fs");

var googleAuth = require('google-auth-library');

  var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
  //var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  //    process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_DIR = "credentials\\";
  var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

export function authThenProcess (req, res, callback) {
    console.log("In authThennProcess");

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return res.status(502).send('Error loading client secret file: ' + err);
      }
      // Authorize a client with the loaded credentials, then call the
      // Drive API.
      authorize(JSON.parse(content), callback, req, res);
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
