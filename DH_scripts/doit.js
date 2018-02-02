const { exec } = require('child_process');

var excelFile = "Heroes.xlsx";
//const child = exec('dir', [ excelFile ], (error, stdout, stderr) => {
  const child = exec( excelFile, (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
