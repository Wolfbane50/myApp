// parse_chachi_excel.js

parse_chachi_excel = function () {
	XLSX = require('xlsx');
	var ch_path = "C:\\Users\\daniel.heaney\\Documents\\c2_tree\\";
	var workbook = XLSX.readFile(ch_path + 'newCards.xlsx');
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
			if (row.fname) {
			// Skip any rows without a url
				//console.log("name : " + row.name);
				//console.log("url : " + row.link);
				var card = {
					"name" : row.name,
					"type" : row.type,
					"brand" : row.brand,
					"team" : row.team,
					"link" : row.path + "/" + row.fname
				};
				chachi_set.cards.push(card);
				continue;
			}
			if (row.name) {
				// Name with no link indicates the start of a new set
				if (chachi_set.cards.length) {
					// Push current set and clear it out for use by new set
					chachi_db.push(chachi_set);
					
					chachi_set.cards = [];
				}
				chachi_set.year = row.name;
			}

		});
		chachi_db.push(chachi_set);

	}
	return chachi_db;
};
//console.log(JSON.stringify(parse_chachi_excel()));

var ch_path = "C:\\Users\\daniel.heaney\\Documents\\c2_tree\\";

var fs = require('fs');
fs.watchFile(ch_path + 'newCards.xlsx', function (curr, prev) {
   if (curr.mtime.getTime() !== prev.mtime.getTime()) {
       console.log('Updating carddirs.json');
       fs.writeFile(ch_path + 'carddirs.json',
           JSON.stringify(parse_chachi_excel()));

    }
});