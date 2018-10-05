//import {read} from 'excel-data'
var read = require('excel-data').read; 

read(
	[
		'Hawley SPS Export 2_16_16.xlsx'
	],
	{
		skipRows: 0,		// optional: ignore first N rows 
		mergeData: true	// optional: merge same data from all sheets 
		//acceptsSheet: sheetName => sheetName.startsWith('employee')	// optional: sheetName as already in lowercase 
	}
)
.then(result => {
	// code to proceed result 
	console.log(JSON.stringify(result));
})
