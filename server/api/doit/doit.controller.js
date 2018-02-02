'use strict';

const { exec } = require('child_process');

export function doit(req, res) {

  // Assumption is that Windows knows what to run for this file
   var officeFile = req.query.file;
   console.log("doit:  About to execute " + req.query.file)
   var cmd = '"' + officeFile + '"';

    const child = exec( cmd, (error, stdout, stderr) => {
      if (error) {
        console.log("Error from executing file");
        //res.status(500).send("Returned error");
        console.log(stderr);
      }
      console.log(stdout);

    });
    res.status(200).send("File spawned");
}
