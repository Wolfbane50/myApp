'use strict';

//  Server Side contorller to manage a database of metadata on music in a directory structure
//     Directory Structure:
//        Base
//          - Artists (d)
//          -    Albums (d)
//                  - <subdirectories> (d) Optional
//                       Music Files (.mp3, .flac, etc.)

var fs = require("fs");
var FindFiles = require("node-find-files");
var path = require('path');
var async = require('async');

var searchDirectories = [
  "Z:/DLGR_NAVSEA_Projects/FFG/CS Baseline/FFG Interfaces/Working Interfaces",
  "Z:/DLGR_NAVSEA_Projects/FFG/CS Baseline/FFG Interfaces/FFG ICDs",
  "Z:/DLGR_NAVSEA_Projects/FFG/FF Archive/+CS Technical Baseline/Interfaces",
  "Z:/DLGR_NAVSEA_Projects/FFG/FF Archive/FF Work In Progress/Interfaces/External Interfaces",
  "Z:/DLGR_NAVSEA_Projects/FFG/FF Archive/FF Work In Progress/Interfaces/Other Related Program Specs",
  "Z:/DLGR_NAVSEA_Projects/FFG/FF Archive/FF Work In Progress/Interfaces/Other Related Program Specs/IFF",
  "Z:/DLGR_NAVSEA_Projects/FFG/SE CPT/PEO IWS 6 - Navigation/Latency/IDS's",
  "C:/Users/daniel.heaney/Documents/AMOD/IDS",
  "Z:/DLGR_NAVSEA_Projects/FFG/SE CPT/Angie's Wish List Items",
  "Z:/DLGR_NAVSEA_Projects/FFG/Architecture/Interfaces",
  "Z:/DLGR_NAVSEA_Projects/Virtualization Efforts/VPS/Weapon Specs"
];

var results = [];

function findIds(directory, findString, callback) {


  var finder = new FindFiles({
    rootFolder: directory,
    filterFunction: function(path, stat) {
      if (stat.isFile()) {
        return (path.indexOf(findString) < 0) ? false : true;
      } else {
        return false;
      }
    }
  });

  finder.on("match", function(strPath, stat) {
    //console.log(strPath + " - " + stat.mtime);
    var fileRec = {
      dir: path.dirname(strPath),
      doc: path.basename(strPath)
    };
    results.push(fileRec);
  });

  finder.on("complete", function() {
    callback(null);

  });
  finder.startSearch();
}

export function idsSearch(req, res) {
  // Obtain directories to search
  var term = req.query.term;
  console.log("request keys => " + JSON.stringify(Object.keys(req)));
  console.log("request params => " + JSON.stringify(req.params));
  console.log("request query => " + JSON.stringify(req.query));
  console.log("request bodyy => " + JSON.stringify(req.body));
  console.log("In idsSearch, looking for " + term);
  if (term) {
    results = [];

    async.each(searchDirectories,
      function(dir, callback) {
        console.log("    Looking in " + dir);
        findIds(dir, term, callback);

      },
      function(err) {
        if (results.length) {
          console.log("Returning results");
          res.json(results);
        } else {
          console.log("No results from search");
          return res.status(204).send("No Files Found");
        }
      }
    );
  } else {
    return res.status(400).send("No search term defined");
  }
}
