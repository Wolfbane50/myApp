var fs = require('fs');

var audConfig = "server/public/cpcr_tier_review.json";
var tierHierFile = "server/public/tierdef_hier.json";

function printTierCounts(tierRec, leader) {
  if (! tierRec) {
    console.log("*** Something Wrong Here !  " + JSON.stringify(tierRec));
  }
  var counts = statHash[tierRec.number];
  if (counts) {
    console.log(leader + tierRec.number + " : " + tierRec.name);
    console.log((leader + "     " + "All:  " + counts.all + " CPCRs"));
    console.log((leader + "     " + "ADS:  " + counts.ADS + " CPCRs"));
    console.log((leader + "     " + "C&D:  " + counts.CND + " CPCRs"));
    console.log("");
  } else {
    console.log(leader + tierRec.number + " : " + tierRec.name);
    console.log(leader + "     " + "No CPCRs");
    console.log("");
  }

}

function prettyPrint() {
  fs.readFile(tierHierFile, function(err, content) {
    if (err) {
      console.log('Could not read JSON file ' + tierHierFile + ": " + err);
      return;
    }
    //console.log(content.toString().substr(1, 8));

    tierHier = JSON.parse(content.toString());
    for (var i = 0; i < tierHier.length; i++) {
      var tier0 = tierHier[i]
        printTierCounts(tier0, "");
      if (tier0.items) {
        for (var j = 0; j < tier0.items.length; j++) {
          var tier1 = tier0.items[j];
          printTierCounts(tier1, "     ");
          if (tier1.items) {
            for (var k = 0; k < tier1.items.length; k++) {
              var tier2 = tier1.items[k];
              printTierCounts(tier2, "          ");
            }
          }
        }
      }
    }
  });
}

function incrementCounters(cpcr, counters) {
  counters.all += 1;
  if (cpcr.element === "ADS") {
    counters.ADS += 1;
  }
  if (cpcr.element === "C&D") {
    counters.CND += 1;
  }
}

function processTierRecord(cpcr, tierKey) {
  if (!statHash[tierKey]) {
    statHash[tierKey] = {
      "all": 0,
      "ADS": 0,
      "CND": 0
    };
  }
  incrementCounters(cpcr, statHash[tierKey]);
}

var statHash = {};
fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  //console.log(content.toString().substr(1, 8));

  audData = JSON.parse(content.toString());
  audData.forEach(function(cpcr, index, array) {
    // Tier 0
    processTierRecord(cpcr, cpcr.tier0);
    processTierRecord(cpcr, cpcr.tier0 + '.' + cpcr.tier1);
    processTierRecord(cpcr, cpcr.tier0 + '.' + cpcr.tier1 + '.' + cpcr.tier2);
  });
  //fs.writeFile("server/public/newbigFinist.json", JSON.stringify(filteredList));

  //console.log(JSON.stringify(statHash));
  prettyPrint();
});
