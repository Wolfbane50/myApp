'use strict';
//var myRequest = require('request');
var fs = require("fs");
//var gdrive = require("./components/gdrive");
import gdrive from '../../components/gdrive';
var google = require('googleapis');


export function update(req, res) {
  var gid = req.body.gid;
  var localPath = req.body.path;

  console.log("gsynch.update called with gid=" + gid + "  path = " + localPath);

  // Verify local file exists and is readable
  var stats;
  var localModified;
  try {
    stats = fs.statSync(localPath);
  } catch (err) {
    console.log("Failed statSync: " + err);
    return res.status(400).send("Cannot get status of file to be synched: " + localPath + " : " + err);
  }
  if (!stats.isFile()) {
    console.log("Path to synch is not a file");
    return res.status(400).send("File to be synched is not a file: " + localPath);
  }

  // Retain the loccal modification time of the file
  localModified = stats.mtime;


  gdrive.gdriveReq(req, res, function(oauth2Clientm, req, res) {
    console.log("Got to gdriveReq callback!");
    var service = google.drive('v3');
    var remoteModified;

    // Find modification time of file on Drive
    service.files.get({
      auth: oauth2Clientm,
      fileId: req.body.gid,
      fields: "modifiedTime, name, version"
    }, function(err, response) {
      if (err) {

        console.log('The File.get API returned an error: ' + err);
        return res.status(502).send("Request to Google Drive returned " + err);
      }
      if (response.modifiedTime) {
        // got kind, id, name, mimeType
        console.log("remote File Modified time: " + JSON.stringify(response.modifiedTime));
        //console.log("API returned type of " + typeof response.modifiedTime);
        // Create Date object from returned time
        var dtstr = response.modifiedTime;
        dtstr = dtstr.replace(/\D/g, " ");
        var dtcomps = dtstr.split(" ");
        dtcomps[1]--;
        remoteModified = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
        console.log("Remote time is " + remoteModified);
        console.log("Local Modified time is " + localModified);
        if (remoteModified > localModified) {
          console.log("-->  Download");
          var dest = fs.createWriteStream(localPath);
          service.files.get({
              auth: oauth2Clientm,
              fileId: req.body.gid,
              alt: 'media'
            })
            .on('error', function(err) {
              console.log('Error downloading file from Drive: ' + err);
              return res.status(502).send('Error downloading file from Drive: ' + err);
            })
            .pipe(dest);

          dest
            .on('finish', function() {
              console.log("Downloaded file");
              return res.status(200);
            })
            .on('error', function(err) {
              console.log("Error writing file: " + err);
              return res.status(502).send('Error writing downloaded file: ' + err);
              // Will likely happen if file is open in Excel
            });

        } else {
          console.log("--> Upload");
          service.files.update({
            auth: oauth2Clientm,
            fileId: req.body.gid,
            uploadType: 'media',
            media: {
              body: fs.createReadStream(localPath)
            }
          }, function(err, response) {
            if (err) {
              console.log('Error downloading file from Drive: ' + err);
              return res.status(502).send('Error downloading file from Drive: ' + err);
            }
            console.log("Uploaded File");
            return res.status(200);
          });
        }
      } else {
        console.log("No modifiedTime in response, response = " + JSON.stringify(response));
      }
      return res.status(200).send("I dont do anything yet!");

    });

    // Upload if Local is newer

    // Download if Remote file is newer


  });


  //return res.status(200).send("I dont do anything yet!");
}
