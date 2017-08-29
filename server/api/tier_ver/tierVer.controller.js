'use strict';

var read = require('excel-data').read;


export function parseTier(req, res) {
  console.log("In parseTier");
  read(
		[
			'23 Aug.xlsx'
//                        'SPS RVM 03-22-16.xlsx'
		],
		{
			skipRows: 0,		// optional: ignore first N rows
			mergeData: true	// optional: merge same data from all sheets
			//acceptsSheet: sheetName => sheetName.startsWith('employee')	// optional: sheetName as already in lowercase
		}
	)
	.then(result => {
		// code to proceed result
		//console.log(JSON.stringify(result));
		res.json(result);
	})


}
