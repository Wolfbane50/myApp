'use strict';

var fs = require("fs");
var fse = require("fs-extra"); // Used for copy, move of files
var FindFiles = require("node-find-files");
var path = require('path');
var each = require('async-each');
var myRequest = require('request');

function isDocumentFile(filePath) {
  var extensions = [".pdf", ".html", ".epub", ".chm"];

  for (var i = 0; i < extensions.length; i++) {
    if (path.extname(filePath) == extensions[i]) {
      return true;
    }
  }
  return false;
}

function sanitizeTitle(docPath) {
  // Remove path and extensions
  //  console.log("Input title: " + docPath);
  var title = path.basename(docPath, path.extname(docPath));

  // Substitute underscores and dots with spaces
  title = title.replace(/\./g, ' ');
  title = title.replace(/\_/g, ' ');
  title = title.replace(/\-/g, ' ');
  //  console.log("Returning title: " + title);
  //  console.log("-----");
  return title;
}

export function newLoadstage(req, res) {
  var stageBaseDir = req.query.stage_directory;
  //console.log("Starting stage search in " + stageBaseDir);


  var items = [];
  var finder = new FindFiles({
    rootFolder: stageBaseDir,
    // Only want files that are documents
    filterFunction: function(path, stat) {
      //console.log("Filter: " + path);
      if (stat.isFile()) {
        return isDocumentFile(path);
      } else {
        return false;
      }
    }
  });
  finder.on("match", function(strPath, stat) {
    //console.log("Match: " + strPath);

    var newDoc = {
      name: strPath,
      title: sanitizeTitle(strPath)
    };
    items.push(newDoc);
  });
  finder.on("complete", function() {
    var docRec = {
        identifier: 'name',
        label: 'name',
        stage_path: stageBaseDir,
        items: items
      }
      //console.log("Returning => " + JSON.stringify(docRec));
    res.json(docRec);
  });
  finder.startSearch();
}

function validateDirectory(dir, writeable) {
  console.log("Validating " + dir + " is " + ((writeable) ? "rw" : "readable"));
  if (dir) {

    var stats = fs.statSync(dir);
    if (stats.isDirectory()) {
      try {
        var mode = ((writeable) ? (fs.R_OK | fs.W_OK) : (fs.R_OK));
        //console.log("Checking mode: " + mode);
//        fs.accessSync(dir, fs.R_OK);
        fs.accessSync(dir, mode);
      } catch (err) {
        console.log("Failed accessSync: " + error);
        return false;
      }
      console.log("File is good!");
      return true; // Good to go
    }
    //console.log("Not a directory!");
  }
  //console.log("NAHHHH!");
  return false;
}

export function saveStage(req, res) {
  console.log("Checking stage directory");
  var stageDir = req.body.stage_directory;
  if (!validateDirectory(stageDir, false)) {
    console.log("Invalid stage directory");
    return res.status(502).send("Invalid stage directory");
  }

console.log("Checking target directory");
  var targetDir = req.body.target;
  if (!validateDirectory(targetDir, true)) {
    console.log("Invalid target directory");
    return res.status(502).send("Invalid target directory");
  }

  var stageDocs = req.body.documents;

  console.log("Initialize descriptor");
  var docDescrs = [];
  for (var i = 0; i < stageDocs.length; i++) {
    docDescrs.push({
      doc: stageDocs[i],
      fileValid: false,
      savedToDb: false,
      moved: false
    });
  }
console.log("Done with descriptor");
  // foreach document via async
  //     is it a file and is it readable -
  //          should I use name or URL?
  //     Add to database
  //     Move file
  //         Rollback database if move uncsuccessful ?
  //     Build up status object along the way
  // when done
  //     Create an overall status (Good if all files successful)
  //     Return status object to client
  //         Success of each phase (valid, db, move)
  //         Database ID
  function stageFilePath(doc) {
    return stageDir + "/" + doc.url;
  }

  function targetFilePath(doc) {
    return targetDir + "/" + doc.url;
  }

  function moveStageToTarget(docRec, doneCB) {
    console.log("Moving from stage to target");
    var src = stageFilePath(docRec.doc);
    var dest = targetFilePath(docRec.doc);
    fse.move(src, dest, function(err) {
      if (err) {
        docRec.moveError = err;
      } else {
        docRec.moved = true;
      }
      doneCB();
    });
  }

  function addDatabase(docRec, doneCB) {
    console.log("adding file to database");
    var reqOptions = {
      url: 'http://localhost:3000/documents',
      method: 'POST',
      json: true,
      headers: {
        'Content_Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        document: docRec.doc
      }
    };

    myRequest(reqOptions, function(error, response, body) {
      if (error) {
        console.log("Request returned error -> " + error);
        // It would be nice to save what happened
        docRec.dbError = "Create returned " + response.statusCode + "; err = " + error;
      } else {
        // Successful Status code out of document.create should be 201
        if (response.statusCode == 201) {
          docRec.id = body.id;
          docRec.savedToDb = true;
          moveStageToTarget(docRec, doneCB);
        } else {
          docRec.dbError = "Create returned " + response.statusCode + "; expected 201";
        }

      }
      return doneCB();
    });

  }

  function validateFile(docRec, doneCB) {
    console.log("Validationg file");
    var file = stageFilePath(docRec.doc);
    fs.stat(file, function(err, stats) {
        if (err) {
          docRec.fileValErr = err;
          console.log("Error calling fs.stat: " + err);
        } else {
          if (stats.isFile()) {

            // Could make sure file isn't in target directory

            docRec.fileValid = true;
            return addDatabase(docRec, doneCB);
          }
          console.log("Not a file: " + file);
          docRec.fileValErr = "Not a file";
        }
        return doneCB();
      });
    }

    function distillStatus(docRecs) {
      var successes = 0;
      var statuses = [];
      for (var i = 0; i < docRecs.length; i++) {
        var rec = docRecs[i];
        if ((rec.fileValid) && (rec.savedToDb) && (rec.moved)) {
          successes++;
        }
        var stat = {
          name: rec.doc.title,
          fileValid: rec.fileValid,
          savedToDb: rec.savedToDb,
          moved: rec.moved
        };
      if (rec.moveError) stat.moveError = rec.moveError;
      if (rec.dbError) stat.dbError = rec.dbError;
      if (rec.fileValErr) stat.fileValErr = rec.fileValErr;
      if (rec.id) stat.id = rec.id;
      statuses.push(stat);
    }
    return {
      overallStatus: (successes == docRecs.length) ? true : false,
      statusDescription: "Completed " + successes + " out of " + docRecs.length,
      docStatus: statuses
    };
  }

 console.log("Starting to process each document");
  each(docDescrs, validateFile, function(error, contents) {
    // Create skeleton status object
    var stageStatus = distillStatus(docDescrs);

    if (error) {
      // This should be fairly catestrophic
      stageStatus.overallStatus = false;
      stateStatus.error = error;
      console.log("Found error in completion of each: " + error);
      return res.status(502).json(stageStatus);
    }
    console.log("Returning good with status => " + JSON.stringify(stageStatus));
    return res.json(stageStatus);
  });

}
