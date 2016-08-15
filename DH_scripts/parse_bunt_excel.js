var fs = require('fs');
XLSX = require('xlsx');
var ch_path = "./";
var s_path = "server/public/";

parse_chachi_excel = function() {
  var workbook = XLSX.readFile(ch_path + 'buntseries2.xlsx');
  var jsonOut = s_path + "bunt.json";
  var idSheets = {
    "ID Table": 1
    //"Insert Old ID Table": 1
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
    console.log("Sheet = " + sheet_name);

    if (idSheets[sheet_name]) {
      console.log("Sheet OK = " + sheet_name);
      var worksheet = workbook.Sheets[sheet_name];
      var chachi_set = {
        "year": sheet_name,
        "cards": []
      };

      // Parse through rows
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
      roa.forEach(function(row) {
        console.log("In Row, name = " + row.name);
        if (row.name) { // Skip rows with no name
          if (row.id) {
            if (row.id.match(/^No/)) {
              console.log("ID is No: " + row.id);
            } else {

              // Skip any rows without a url
              console.log("name : " + row.name);
              console.log("id : " + row.id);
              var card = {
                "name": row.name,
                "id": row.id
              };
              chachi_set.cards.push(card);

            }
          } else {
            // Name but no ID indicates start of new set

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
};

fs.writeFile(s_path + 'bunt.json',
  JSON.stringify(parse_chachi_excel()));
