'use strict';

var fs = require("fs");

const {
  exec
} = require('child_process');
import config from '../../config/environment';
export function doit(req, res) {

  // Assumption is that Windows knows what to run for this file
  var officeFile = req.query.file;
  console.log("doit:  About to process " + req.query.file);
  if (officeFile.match(/localhost:9000/)) {
    //  !!!!!!!!!!!!!!!  This will only work on NMCI Machine - Need to put into local config
    var docsDir = config.myDocsDir.replace(/\\/g, '/') + '/';

    // console.log("Should send to " + docsDir);
    officeFile = officeFile.replace(/^http:\/\/localhost:9000\//, docsDir);
  }
  var stats;
  try {
    stats = fs.statSync(officeFile);
  } catch (err) {
    console.log("Failed statSync: " + err);
    return res.status(400).send("Cannot get status of file to execute: " + officeFile + " : " + err);
  }
  if (!stats.isFile()) {
    console.log("Path to execute is not a file");
    return res.status(400).send("File to be execute is not a file: " + officeFile);
  }


  console.log("doit:  About to execute " + officeFile);

  var cmd = '"' + officeFile + '"';

  const child = exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log("Error from executing file");
      //res.status(500).send("Returned error");
      console.log(stderr);
    }
    console.log(stdout);

  });
  res.status(200).send("File spawned");
}
