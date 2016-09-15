'use strict';
var fs = require("fs");
var FindFiles = require("node-find-files");
var path = require('path');
var XLSX = require('xlsx');


export function index(req, res) {
  console.log("-------------In newCards server --");
  //console.log("Request ==>\n" + JSON.stringify(req.body));

  var cardfiles = [];
  var cardDir;

  if (req.query.directory) {
    cardDir = req.query.directory;
  } else {
    cardDir = "./server/public/cards";

  }

  var pubDir = "server/public/";
  var processNewCard = function(strPath, stat) {
    if (stat.isDirectory()) {

    } else {
      console.log("Adding " + strPath);
      if ((path.extname(strPath) == '.jpg') || (path.extname(strPath) == '.png')) {
        var trimpath = path.dirname(strPath);
        // Strip the public directory particular
        //console.log("trimpath: " + trimpath + "  pubDir: " + pubDir + " with lenght: " + pubDir.length);
        trimpath = trimpath.substr(pubDir.length);
        var re = /\\/g;
        trimpath = trimpath.replace(re, '/');
        trimpath = trimpath.replace('^\./', '');
        //console.log("trimpath: " + trimpath);
        var rec = {
          'path': trimpath,
          'fname': path.basename(strPath)
        };
        //console.log('Pushing into cardfiles');
        cardfiles.push(rec);
      }
    }


  };
  // Get the last Date processed
  var lastDateStr = req.body.lastDate;
  var dtstr = req.query.lastDate.replace(/\D/g, " ");
  var dtcomps = dtstr.split(" ");
  dtcomps[1]--;
  var lastDate = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));

  var finder = new FindFiles({
    rootFolder: cardDir,
    fileModifiedDate: lastDate
  });

  finder.on("match", function(strPath, stat) {
    //console.log(strPath + " - " + stat.mtime);
    processNewCard(strPath, stat);
  })
  finder.on("patherror", function(err, strPath) {
    console.log("Error for Path " + strPath + " " + err) // Note that an error in accessing a particular file does not stop the whole show
  })
  finder.on("error", function(err) {
    console.log("Global Error " + err);
  })
  finder.on("complete", function() {
    console.log("Finished");
    if (cardfiles.length) {
      fs.writeFile("server/public/carddirs.json", JSON.stringify(cardfiles));
    } else {
      console.log("No new files discovered!");
      return res.status(500).send("No new files discovered!");
    }
    res.redirect(303, '/carddirs.json');
  })
  finder.startSearch();

}

export function update(req, res) {
  // Should get data from tagging and update ss_cards.json
  function parse_chachi_excel() {
    var ch_path = "./";
    var workbook = XLSX.readFile(ch_path + 'newCards.xlsx');
    var jsonOut = ch_path + "ss_cards.json";
    // Specify worksheets to process
    var idSheets = {
      "Bunt": 1,
      "Huddle Offseason": 1
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
      //console.log("Sheet = " + sheet_name);

      if (idSheets[sheet_name]) {
        var chachi_set = {
          "year": sheet_name,
          "cards": []
        };
        var worksheet = workbook.Sheets[sheet_name];

        // Parse through rows
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
        roa.forEach(function(row) {
          if (row.Name) { // Skip rows with no name
            if (row['File Name']) {
              if (row['File Name'].match(/^No/)) {
                //console.log("ID is No: " + row.id);
                // Could put a default image here
              } else {
                // Skip any rows without a url
                //console.log("name : " + row.name);
                //console.log("url : " + row.link);
                var card = {
                  "name": row.Name,
                  "path": row.Path,
                  "fname": row['File Name'],
                  "type": row.Type,
                  "brand": row.Brand,
                  "team": row.Team
                };
                chachi_set.cards.push(card);
              }

            } else {
              // Name but no Link indicates start of new set
              saveSet(chachi_set);
              chachi_set = {
                "year": row.Name,
                "cards": []
              };
            }
          }

        });
        // Save last set on sheet
        saveSet(chachi_set);
      }
    }
    return chachi_db;
  }

  var s_path = "server/public/";
  console.log('Updating ss_cards.json');
  try {
    fs.writeFileSync(s_path + 'ss_cards.json',
      JSON.stringify(parse_chachi_excel()));

  } catch (e) {
    console.log("Caught exception parsing and writing - " + e);
    return res.status(502).send("e");

  }

  res.redirect(303, '/ss_cards.json');

}

export function findNewCards(req, res) {

}
