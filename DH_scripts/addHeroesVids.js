var fs = require('fs');
XLSX = require('xlsx');
var async = require('async');

var heroesExcel = "Heroes.xlsx";

var audConfig = "server/public/drwho_tv_tree.json";
//var audConfig = "server/public/bunt.json";

var audData;

async.series([
    function(callback) {
      console.log("Reading JSON");
      fs.readFile(audConfig, function(err, content) {
        if (err) {
          var myerr = 'Could not read JSON file ' + audConfig + ": " + err;
          console.log(myerr);
          callback(myerr);
        }

        audData = JSON.parse(content.toString());
        callback(null);
      });
    },
    function(callback) {
      console.log("Reading Excel");
      var workbook = XLSX.readFile(heroesExcel);
      // Assume there is only one worksheet
      var sheet_name = workbook.SheetNames[0];
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
      var doctor_set = {
        "id": "H1",
        "name": "Heroes",
        "items": roa
      };
      roa.forEach(function(row) {
        row.id = new Date();
        row.SPath = "http://NASD9760C/TV Shows/Heroes/Season " + row.Season;
        // Fix the release date, input is MonthName dd, yyyy
        console.log("Released: " + row.Released);
        var dateArr = row.Released.split(' ');  // Special character not shown in editor
        var monLookup = {
          'January': '01',
          'February': '02',
          'March': '03',
          'April': '04',
          'May': '05',
          'June': '06',
          'July': '07',
          'August': '08',
          'September': '09',
          'October': '10',
          'November': '11',
          'December': '12'
        };
        var dateStr = dateArr[2] + '-' + monLookup[dateArr[0]] + '-';
        console.log("Date Array: " + JSON.stringify(dateArr));
        if (dateArr[1].length === 2) {
          dateStr += '0' + dateArr[1].substr(0, 1);
        } else {
          dateStr += dateArr[1].substr(0,2);
        }
        dateStr += 'T04:00:00.000Z';
        row.Released = dateStr;
      });
      audData.push(doctor_set);
      callback(null);
    },
    function(callback) {
      console.log("Writing JSON");
      fs.writeFile("server/public/new_drwho_tv_tree.json", JSON.stringify(audData));
    }
  ],
  // optional callback
  function(err, results) {
    console.log("We are done...");
  });
