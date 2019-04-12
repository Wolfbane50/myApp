var fs = require('fs');
var async = require('async');

var audConfig = "server/public/ffg_interfaces.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {};  // Hash of all unique titles
var flatList = [];
  var idsData = {};

fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }

//  audData = JSON.parse(content.toString().substr(1));  Not sure what was wrong with first character
  audData = JSON.parse(content.toString());


  async.each(Object.keys(audData), function(element, callback) {
    // element 1
    console.log("Working on " + element)
    var ids_array = Object.keys(audData[element]);
    var ids_rec_array = [];
    for (var i=0; i<ids_array.length; i++) {
      var elemRecord = audData[element];
      var theKey = ids_array[i];
      console.log("   ids for " + ids_array[i] + " is " + elemRecord[theKey]);
      var idsRec = {
        name: theKey,
        idsName: elemRecord[theKey],
        number: "",
        classification: "Unclass",
        link: ""
      };
      ids_rec_array.push(idsRec);
    }
    idsData[element] = ids_rec_array;


    callback();
  }, function(err) {
    console.log("Done");
    //console.log(JSON.stringify( idsData ));
    fs.writeFile("server/public/newffg_interfaces.json", JSON.stringify(idsData));
  });

});
