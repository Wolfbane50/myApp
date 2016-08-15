parse_chachi_excel = function() {
  XLSX = require('xlsx');
  var ch_path = "./";
  var s_path = "server/public/"
  var workbook = XLSX.readFile(ch_path + 'buntseries2.xlsx');
  var jsonOut = s_path + "bunt.json";
  var idSheets = {
    "ID Table": 1,
    "Insert Old ID Table": 1
  };

  var chachi_db = [];

  for (var ws_num = 0; ws_num < workbook.SheetNames.length; ws_num++) {
    // Each sheet represents a year/set
    var sheet_name = workbook.SheetNames[ws_num];

    if (idSheets[sheet_name]) {
      //console.log("Sheet = " + sheet_name);
      var chachi_set = {
        "year": sheet_name,
        "cards": []
      };
      var worksheet = workbook.Sheets[sheet_name];

      // Parse through rows
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
      roa.forEach(function(row) {
        if (row.id) {
          // Skip any rows without a url
          //console.log("name : " + row.name);
          //console.log("url : " + row.link);
          var card = {
            "name": row.name,
            "id": row.id
          };
          chachi_set.cards.push(card);
        }

      });
      chachi_db.push(chachi_set);
    }
  }
  return chachi_db;
};
