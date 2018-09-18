var fs = require('fs');
var async = require('async');

var audConfig = "server/public/bigFinish.json";
var featureSprites = "server/public/spriteSpec.min.json";
//var audConfig = "server/public/bunt.json";

var faces = {};
var faceless = {};

var filteredList = [];
var titles = {}; // Hash of all unique titles
var flatList = [];

// Create a lookup table of all sprites in JSON File
fs.readFile(featureSprites, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + featureSprites + ": " + err);
    return;
  }
  var spriteData = JSON.parse(content.toString());
  var table = spriteData.spriteTable;
  //console.log(JSON.stringify(table));
  for (row = 0; row < table.length; row++) {
    for (col = 0; col < table[row].length; col++) {
      var face = table[row][col];
      faces[face] = 1;
    }
  }

  var aliases = spriteData.aliasMap;
  for (var al in aliases) {
    faces[al] = 1;
  }
  //console.log(JSON.stringify(faces));
});


fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  //console.log(content.toString().substr(1, 8));

  //  audData = JSON.parse(content.toString().substr(1));  Not sure what was wrong with first character
  audData = JSON.parse(content.toString());
  async.each(audData, function(element, callback) {
    //console.log("Working on " + element.Title)
    var featuring = element.Featuring;
    if (featuring) {
      features = featuring.split(/\, /);
      for(var i=0; i<features.length; i++) {
        var feat = features[i];
        if(feat) {
          if (! faces[feat]) {
            faceless[feat] = 1;
          }
        }
      }
    }
    //console.log("Checking " + featuring);
    callback();
  }, function(err) {
    console.log(JSON.stringify(faceless));
    //fs.writeFile("server/public/newbigFinish.json", JSON.stringify(flatList));
  });

});
