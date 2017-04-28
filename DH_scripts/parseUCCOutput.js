var fs = require('fs');
const readline = require('readline');
var uccout = "./COMBATSS-21 TOTAL_outfile.txt";

function parseline(line) {
    var tokens = line.split(/\s+/);
    var filename = line.substr(88);
    var pathPieces = filename.split('/');
    var csvLine = tokens[1] + ',' +
                  tokens[2] + ',' +
                  tokens[4] + ',' +
                  tokens[5] + ',' +
                  tokens[7] + ',' +
                  tokens[8] + ',' +
                  tokens[9] + ',' +
                  tokens[11] + ',' +
                  tokens[12] + ',' +
                  tokens[14] + ',' +
                  filename + ',' +
                  pathPieces;
    console.log(csvLine);

    countsArray.push({
      filename: filename,
      totalLines: tokens[1],
      blankLines: tokens[2],
      wholeComments: tokens[4],
      embeddedComments: tokens[5],
      compilerDirect: tokens[7],
      dataDecl:  tokens[8],
      execInstr: tokens[9],
      logSloc: tokens[11],
      physSloc: tokens[12],
      fileType: tokens[14]
    });

}

const rl = readline.createInterface({
  input: fs.createReadStream(uccout)
});

var state = 'starting';
var countsArray = [];

var lineCount = 0;
rl.on('line', (line) => {
  //console.log('Line from file:', line);
  if (state === 'starting') {
      if (line.match(/^\s+\d/)) {
        // Found start of data
        // console.log("Changing state to parsing in line " + lineCount);
        state = 'parsing';
      } else {
        //console.log("Skipping line " + lineCount);
      }
  }
  if (state === 'parsing') {
    // Blank line indicates end of the data
    if (line.match(/\S/)) {
      //console.log("Parsing line " + lineCount);
      parseline(line);
    } else {
//      console.log("Done at line " + lineCount);
      state = 'done'
    }
  }
  lineCount++;
});
