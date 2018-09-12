// parse_chachi_excel.js
var all_mixins = {};
var ffg_mixins = [];
var tree_array = {};
var applicableBaselines = [];

searchItems = function(term, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].name === term) {
      return i;
    }
  }
  return -1;
};

addEntity = function(mixin, idx) {
  var entities = mixin.split(/\./);
  //console.log(JSON.stringify(entities));

  var entryPoint = all_mixins;
  var treePtr = tree_array;
  for (i = 0; i < entities.length; i++) {
    //console.log("Working on " + entities[i] + " of " + mixin);
    var entity = {
      "name": entities[i],
      "fullname": mixin
    };

    if (entryPoint[entities[i]]) {} else {
      entryPoint[entities[i]] = {};
    }
    entryPoint = entryPoint[entities[i]];
    if (!treePtr.items) {
      treePtr.items = [entity];
      treePtr = treePtr.items[0]
    } else {
      var index = searchItems(entities[i], treePtr.items)
      if (index == -1) {
        // Not found in items, so add it
        treePtr.items.push(entity);
        treePtr = treePtr.items[treePtr.items.length - 1];
      } else {
        // entity exists in items
        treePtr = treePtr.items[index];
      }
    }
  }
  return treePtr;
};

addApplicability = function(recordPtr, row) {
  var exceptions = {
    "Mixin": true,
    "Doors Count": true,
    "CPP": true,
    "Make": true,
    "XML": true,
    "Drist": true,
    "Table": true,
    "ADA": true
  };
  for (col in row) {
    if (exceptions[col]) {
      continue;
    }
    recordPtr[col] = row[col];
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
      //console.log("Worksheet range = " + worksheet['!ref']);  // => A1:CS666

      // Get all the Baseline namesArr
      var blObj = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: "I2:CS2"
      });
      applicableBaselines = blObj[0];
      for (var j=0; j<8; j++) {
        applicableBaselines.shift();
      }
      //console.log(JSON.stringify(applicableBaselines));
      tree_array.applicableBaselines = applicableBaselines;


      // Parse through rows
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {
        range: 1
      });
      var row_num = 0;
      //console.log(JSON.stringify(roa));
      roa.forEach(function(row) {
        //console.log(JSON.stringify(row));
        //console.log(row.A + ' ' + (row.AQ ? "FFG" : ''));
        recordPtr = addEntity(row.Mixin, row_num);
        //console.log("For " + row.Mixin + ", Added " + JSON.stringify(recordPtr));
        addApplicability(recordPtr, row);
        if (row.FFGX) {
          ffg_mixins.push(row.Mixin);
        }
        row_num++;
      });
      // Save last set on sheet
      //console.log(JSON.stringify(all_mixins));
      //saveSet(chachi_set);
    }
  }
};

parse_gears_excel();
var fs = require('fs');
var s_path = "server/public/";
//console.log('Updating Chachi.json');
//console.log(JSON.stringify(applicabilityTruthTable));
fs.writeFile(s_path + 'mixins.json',
  JSON.stringify(tree_array));
//  JSON.stringify(all_mixins));
