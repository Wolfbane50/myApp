'use strict';

var fs = require("fs");
var fse = require("fs-extra"); // Used for copy, move of files
var FindFiles = require("node-find-files");
var path = require('path');
var async = require('async');
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
    var name = strPath.replace(/\\/g, '/');
  //  console.log("Name of file in stage (after slash replace) is " + name);
    if (name.indexOf(stageBaseDir) == 0) {  // StageDir in the url
        //console.log("Cutting stage dir out of filename");
       name = name.substr(stageBaseDir.length + 1);
    }
    var newDoc = {
      name: name,
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
    var stats;
    try {
      stats = fs.statSync(dir);
    } catch (err) {
      console.log("Failed statSync: " + err);
      return false;
    }
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
    console.log("Invalid stage directory: " + stageDir);
    return res.status(422).send("Invalid stage directory: " + stageDir);
  }

console.log("Checking target directory");
  var targetDir = req.body.target;
  if (!validateDirectory(targetDir, true)) {
    console.log("Invalid target directory");
    return res.status(422).send("Invalid target directory");
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
    //console.log("Moving from stage to target");
    var src = stageFilePath(docRec.doc);
    var dest = targetFilePath(docRec.doc);
    try {
    fse.move(src, dest, function(err) {
      if (err) {
        // Particular problem - Getting EBUSY on unlink portion of move.
        //    --> Explicitly try unlink
      if ((err.code == 'EBUSY') &&  (err.syscall == 'unlink')) {
        try {
          console.log("Got EBUSY, retrying unlink");
          fs.unlinkSync(src);
        } catch(err) {
          // Still didn't work, so return error
          docRec.moveError = err;
          //console.log("Calling final doneCB from move " + docRec.doc.title);
          return doneCB();
        }
      }
        console.log("Move of " + docRec.doc.title + " bad: " + err);
        docRec.moveError = err;
      } else {
        //console.log("Move of " + docRec.doc.title + "is good!");
        docRec.moved = true;
      }
      //console.log("Calling final doneCB from move " + docRec.doc.title);
      doneCB();
    });
    } catch (err) {
      console.log("Move threw error!  doc = " + docRec.doc.title);
    }
    //console.log("Returning from move " + docRec.doc.title);
  }

  function addDatabase(docRec, doneCB) {
  //  console.log("adding file to database");
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
        //console.log("Return -> " + body);
        // It would be nice to save what happened
        docRec.dbError = "Create returned " + response.statusCode + "; err = " + error;
        if (body.message) {
          docRec.dbError += "\n  error: " + body.message;
        }
      //  console.log("Calling doneCB from save to DB");
        return doneCB();
      } else {
        // Successful Status code out of document.create should be 201
        if (response.statusCode == 201) {
        //  console.log("Db saved good!");
          docRec.id = body.id;
          docRec.savedToDb = true;
          moveStageToTarget(docRec, doneCB);
        } else {
          console.log( "Create returned " + response.statusCode + "; expected 201");
          docRec.dbError = "Create returned " + response.statusCode + "; expected 201";
          if (body.message) {
            docRec.dbError += "\n  error: " + body.message;
          }
//          console.log("Return -> " + JSON.stringify(body));
          //console.log("Calling doneCB from save to DB");
          return doneCB();
        }
      }

    });

  }

  function validateFile(docRec, doneCB) {
    //console.log("Validating file");
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
        console.log("Calling doneCB from validateFile");
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

//console.log("Starting to process each document");
  async.each(docDescrs, validateFile, function(error) {
    // Create skeleton status object
    console.log("Done Callback");
    var stageStatus = distillStatus(docDescrs);

    if (error) {
      // This should be fairly catestrophic
      stageStatus.overallStatus = false;
      stateStatus.error = error;
      console.log("Found error in completion of each: " + error);
      return res.status(422).json(stageStatus);
    }
//    console.log("Returning good with status => " + JSON.stringify(stageStatus));
    return res.json(stageStatus);
  });

}
