'use strict';

var read = require('excel-data').read;
var async = require('async');


function parseTierDefs() {
  console.log("In parseTier");
  read(
      [
        'Proposed Tier 2 ruleset.xlsx'
        //                        'SPS RVM 03-22-16.xlsx'
      ], {
        skipRows: 0, // optional: ignore first N rows
        //mergeData: true	// optional: merge same data from all sheets
        acceptsSheet: sheetName => sheetName.startsWith('proposed') // optional: sheetName as already in lowercase
      }
    )
    .then(result => {
      // code to proceed result
      //console.log(JSON.stringify(result));
      // Parse Tier 0

      var tiers = result.proposedtier2rules.data;
      // console.log(JSON.stringify(tiers));
      var tierHash = {};
      async.each(tiers, function(rec, callback) {
        //console.log(JSON.stringify(rec));
        tierHash[rec.functionnumber] = {
          number: rec.functionnumber, // redundant
          name: rec.functionname,
          definition: rec.functiondefinition,
          proposeduse: rec.proposeduse,
          tier: rec.tier
        };
        callback();
      }, function(err) {
        console.log(JSON.stringify(tierHash));
      });
    });
}
parseTierDefs();
