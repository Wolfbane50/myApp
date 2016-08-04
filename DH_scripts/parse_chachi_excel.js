// parse_chachi_excel.js

parse_chachi_excel = function () {
	XLSX = require('xlsx');
	var ch_path = "C:\\Users\\daniel.heaney\\Documents\\c2_tree\\";
	var workbook = XLSX.readFile(ch_path + 'chachis.xlsx');
	var jsonOut = ch_path + "chachis3.json";

	var chachi_db = [];

	for (var ws_num = 0; ws_num < workbook.SheetNames.length; ws_num++) {
		// Each sheet represents a year/set
		var sheet_name = workbook.SheetNames[ws_num];
		//console.log("Sheet = " + sheet_name);
		var chachi_set = {
		   "year" : sheet_name,
		   "cards" : []
		};
		var worksheet = workbook.Sheets[sheet_name];

		// Parse through rows
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name]);
		roa.forEach(function(row) {
			if (row.link) {
			// Skip any rows without a url
				//console.log("name : " + row.name);
				//console.log("url : " + row.link);
				var card = {
					"name" : row.name,
					"link" : row.link
				};
				chachi_set.cards.push(card);
			}

		});
		chachi_db.push(chachi_set);

	}
	return chachi_db;
};
//console.log(JSON.stringify(parse_chachi_excel()));

var ch_path = "C:\\Users\\daniel.heaney\\Documents\\c2_tree\\";
var out_path = "server\\public\\";

var fs = require('fs');
fs.watchFile(ch_path + 'chachis.xlsx', function (curr, prev) {
   if (curr.mtime.getTime() !== prev.mtime.getTime()) {
       console.log('Updating Chachi.json');
       fs.writeFile(out_path + 'chachis3.json',
           JSON.stringify(parse_chachi_excel()));

    }
});
