'use strict';
var fs = require("fs");
var XLSX = require('xlsx');

export function index(req, res) {
  console.log("In chachi index ...");
  res.redirect(303, '/chachis3.json');

}

export function update(req, res) {
  // replicate functionality of DH_scripts/parse_chachi_excel


  function parse_chachi_excel() {
    var ch_path = "./";
    var workbook = XLSX.readFile(ch_path + 'chachis.xlsx');
    var jsonOut = ch_path + "chachis3.json";
    // Specify worksheets to process
    var idSheets = {
      "Misc": 1,
      "2016": 1,
      "2015": 1,
      "2005": 1,
      "2006": 1,
      "2007": 1,
      "2008": 1,
      "2009": 1,
      "2010": 1,
      "2011": 1,
      "2012": 1,
      "2013": 1,
      "2014": 1,
      "Now": 1,
      "1970": 1,
      "2016 Team Issue": 1,
      "Missing Links": 1,
      "2016 Archives": 1,
      "1973 Topps": 1,
      "1963 Topps": 1
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
          if (row.name) { // Skip rows with no name
            if (row.link) {
              if (row.link.match(/^No/)) {
                //console.log("ID is No: " + row.id);
                // Could put a default image here
              } else {
                // Skip any rows without a url
                //console.log("name : " + row.name);
                //console.log("url : " + row.link);
                var card = {
                  "name": row.name,
                  "link": row.link
                };
                chachi_set.cards.push(card);
              }

            } else {
              // Name but no Link indicates start of new set
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
    return chachi_db;
  }

  console.log("In chachi update again ...");

  var s_path = "server/public/";
  console.log('Updating Chachi.json');
  try {
    fs.writeFileSync(s_path + 'chachis3.json',
      JSON.stringify(parse_chachi_excel()));

  } catch (e) {
    console.log("Caught exception parsing and writing - " + e);
  }

  res.redirect(303, '/chachis3.json');
}
