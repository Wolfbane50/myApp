var fs = require('fs');
var async = require('async');

var audConfig = "server/public/cbbs_excel.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {};  // Hash of all unique titles
var flatList = [];

fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }

//  audData = JSON.parse(content.toString().substr(1));  Not sure what was wrong with first character
  audData = JSON.parse(content.toString());
  var cbbList = audData.cbb_definitions.data;
  //console.log(JSON.stringify(audData));
  //console.log(Object.keys(audData));

  async.each(cbbList, function(element, callback) {
    var defn = element.cbbdefinition;
    var cbbRec = {
      "name" : element.cbbname,
      "missionarea" : element.missionarea.split('/'),
      "cig" : element['cig#'],
      "definition" : defn
    };
    if (defn.includes("Impacted Elements:")) {
      cbbRec.definition = defn.substring(0, defn.indexOf("Impacted Elements: "));
      cbbRec.elements = defn.substring(defn.lastIndexOf("Impacted Elements: ")+20).split(',');
    }
    //console.log("Working on " + element.cbbname);
    //console.log("   Def: " + cbbRec.definition);
    //console.log("   Elements: " + cbbRec.elements);
    flatList.push(cbbRec);
    callback();
  }, function(err) {
    console.log("Done");
    fs.writeFile("server/public/cbbs.json", JSON.stringify(flatList));
  });

});
