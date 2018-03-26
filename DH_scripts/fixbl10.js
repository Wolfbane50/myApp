var fs = require('fs');
var async = require('async');

var audConfig = "server/public/bl10_interfaces.json";
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

  async.each(Object.keys(audData), function(element, callback) {
    console.log("Working on " + element)
    callback();
  }, function(err) {
    console.log("Done");
    //fs.writeFile("server/public/newbigFinish.json", JSON.stringify(flatList));
  });

});
