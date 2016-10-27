'use strict';

var fs = require("fs");
var FindFiles = require("node-find-files");
var path = require('path');
var async = require('async');

function isDocumentFile(filePath) {
  var extensions = [".pdf", ".html", ".epub", ".chm"];

  for (var i = 0; i < extensions.length; i++) {
    if (path.extname(filePath) == extensions[i]) {
      return true;
    }
  }
  return false;
}

function sanitzeTitle(docPath) {
  // Remove path and extensions
  var title = path.basename(docPath);

  // Substitute underscores and dots with spaces
  title = title.replace('/\./g', ' ');
  title = title.replace('/\_/g', ' ');
  title = title.replace('/\-/g', ' ');
  return title;
}

export function newLoadstage (req, res) {
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
      console.log("Match: " + strPath);

      var newDoc = {
        name: strPath,
        title: sanitizeTitle(strPath)
      };
      console.log("Pushing " + JSON.stringify(newDoc));
      items.push(newDoc);
      //console.log("Items => " + JSON.stringify(items));
    });
    finder.on("complete", function() {
       var docRec = {
         identifier: 'name',
     		 label : 'name',
     		 stage_path : stageBaseDir,
        items: items
       }
       console.log("Returning => " + JSON.stringify(docRec));
       res.json(docRec);
    });
    finder.startSearch();


}
