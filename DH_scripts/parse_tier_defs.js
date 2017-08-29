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
        console.log(JSON.stringify(result));
        // Parse Tier 0

        var tiers = result.proposedtier2rules.data;
        var tierHierarchy = {};

        async.reduce(tiers, tierHierarchy, function(item, hier, callback) {
            if ((item.tier === "0") {
                hier[item.functionnumber] = {
                  number: item.functionnumber,  // redundant
                  name: item.functionname,
                  definition: item.functiondefinition,
                  proposeduse: item.proposeduse,
                  items: []
                };
              }
              return callback(null, hier);
            }, function(err, hier) {
                //  Parse Tier 1
                async.reduce(tiers, hier, function(item, hier, callback) {
                  if ((item.tier === "1") {
                      var tierNums = item.functionnumber.split(".");
                      
                      hier[item.functionnumber] = {
                        number: item.functionnumber,  // redundant
                        name: item.functionname,
                        definition: item.functiondefinition,
                        proposeduse: item.proposeduse,
                        items: []
                      };
                    }
                    return callback(null, hier);
              }, function(err, hier) {
                    // Parse Tier 2
                });

            });

          function parseTier1(tiers) {
            async.map(tiers, function(item, callback) {
                if ((item.tier === "1") {
                    return callback(null, {
                      number: item.functionnumber,
                      name: item.functionname,
                      definition: item.functiondefinition,
                      proposeduse: item.proposeduse
                    });
                  } else {
                    return callback(null, null);
                  }
                },
                function(results) {
                  tier_hierarchy = results.sort(function(a, b) {
                    return (a.number < b.number);
                  });

                  // Parse Tier 1

                });

            }
            // Parse Tier 1
            // Parse Tier 2
          })


      }
      parseTierDefs();
