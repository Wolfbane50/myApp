'use strict';

var read = require('excel-data').read;


export function convert(req, res) {
  console.log("-------------In excel2json.convert --");
  console.log("Excel file  = " + req.query.excelfile);
  // Handle paths

  // Handle options
  //    Default to taking sheet 0 only
  var options = {
    skipRows: 0,
    mergeData: false
  };
  if (req.query.merge) {
    options.mergeData = true;
  }

  if (req.query.skiprows) {
    options.skipRows = req.query.skiprows;
  }

  if (req.query.sheetStart) {
    options.acceptsSheet = sheetName => sheetName.startsWith(req.body.sheetStart);
  }

  read(
		[
			req.query.excelfile
//                        'SPS RVM 03-22-16.xlsx'
		], options
//		{
//			skipRows: 0,		// optional: ignore first N rows
//			mergeData: true	// optional: merge same data from all sheets
			//acceptsSheet: sheetName => sheetName.startsWith('employee')	// optional: sheetName as already in lowercase
//		}
	)
	.then(result => {
		// code to proceed result
		//console.log(JSON.stringify(result));
		res.json(result);
	})


}
