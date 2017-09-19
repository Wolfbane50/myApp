var fs = require('fs');

var audConfig = "server/public/bigFinish.json";
//var audConfig = "server/public/bunt.json";

var seriesTitleArray = [
  "DWMonthly",

  "3rdDoctor",
  "4th Doctor Adventures",
  "5thDoctor",
  "8th Doctor Adventures",
  "DarkEyes",
  "Doom Coalition",
  "The War Doctor",
  "10th Doctor Adventures",
  "9th Doctor Adventures",


  "Lost Stories",
  "Unbound",
  "EaryAdv",
  "Bonus",
  "Special",
  "DWMAG",
  "ShortTrips",
  "DestinyOfDr",

  "CC",
  "Gallifrey",
  "The Churchill Years",
  "SarahJane",
  "Charlotte Pollard",
  "RiverSongDiary",
  "UNIT",
  "CounterMeasures",

  "BBCWeb",
  "Documentary",
  "DalekEmpire",
  "Cyberman",
  "Idavros",
  "Excelis",
  "AudBook",
  "Novel Adaptations",
  "Philip Hinchcliffe Presents",

];
var seriesLookup = {};  // Hash of all unique titles


function seriesOrder(elemA, elemB) {
  seriesA = elemA.Series;
  seriesB = elemB.Series;
  if(! seriesLookup[seriesA]) {
    if ( seriesA  !== "DWMonthly" )  {
      console.log("Cannot find entry for " + seriesA);
    }
  }
  if(! seriesLookup[seriesB]) {
    if ( seriesA  !== "DWMonthly" ) {
      console.log("Cannot find entry for " + seriesB);
    }
  }
  //console.log("Comparing " + seriesA + " to " + seriesB);
  //console.log("Returning " + (seriesLookup[seriesA] - seriesLookup[seriesB]));
  return seriesLookup[seriesA] - seriesLookup[seriesB];
}

// Create lookup table from array of series titles
for(var i=0; i<seriesTitleArray.length; i++) {
  var title = seriesTitleArray[i];
  seriesLookup[title] = i;
}
console.log(JSON.stringify(seriesLookup));


fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  //console.log(content.toString().substr(1, 8));

//  audData = JSON.parse(content.toString().substr(1));  Not sure what was wrong with first character
  audData = JSON.parse(content.toString());
  console.log(JSON.stringify(seriesLookup));
  audData.sort(seriesOrder);

    fs.writeFile("server/public/newbigFinish.json", JSON.stringify(audData));

});
