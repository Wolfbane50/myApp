// parse_chachi_excel.js
var all_mixins = {};
var ffg_mixins = [];



addEntity = function(mixin) {
  var entities = mixin.split(/\./);
  //console.log(JSON.stringify(entities));

  var entryPoint = all_mixins;
  for (i=0; i<entities.length; i++) {
    if (entryPoint[entities[i]]) {} else {
      entryPoint[entities[i]] ={};
    }
    entryPoint = entryPoint[entities[i]];
  }
};

parse_gears_excel = function() {
  XLSX = require('xlsx');
  var ch_path = "./";
  var workbook = XLSX.readFile(ch_path + 'GearsMatrix_03.35-E06_TD.xlsx');
  var jsonOut = ch_path + "ffg_gears.json";
  // Specify worksheets to process
  var idSheets = {
    "Gears Mixins": 1
  };



  for (var ws_num = 0; ws_num < workbook.SheetNames.length; ws_num++) {
    // Each sheet represents a year/set
    var sheet_name = workbook.SheetNames[ws_num];
    //console.log("Sheet = " + sheet_name);

    if (idSheets[sheet_name]) {
      var worksheet = workbook.Sheets[sheet_name];

      // Parse through rows
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {
        range: 2,
        header: "A"
      });
      var row_num = 0;
      //console.log(JSON.stringify(roa));
      roa.forEach(function(row) {
        //console.log(JSON.stringify(row));
        //console.log(row.A + ' ' + (row.AQ ? "FFG" : ''));
        addEntity(row.A);
        if(row.AQ) {
          ffg_mixins.push(row.A);
        }
      });
      // Save last set on sheet
      console.log(JSON.stringify(all_mixins));
      //saveSet(chachi_set);
    }
  }
};

parse_gears_excel();
var fs = require('fs');
var s_path = "server/public/";
//console.log('Updating Chachi.json');
fs.writeFile(s_path + 'mixins.json',
  JSON.stringify(all_mixins));
