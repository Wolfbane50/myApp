var fs = require('fs');
var async = require('async');

var audConfig = "server/public/bigFinish.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {};  // Hash of all unique titles
var flatList = [];

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
    var seriesList = element.items;
    async.each(seriesList, function(subelement, callback) {
         flatList.push(subelement);
         callback();
       }, function(err) {
         console.log("Flattend Series " + element.Series);
    });
    callback();
  }, function(err) {
    fs.writeFile("server/public/newbigFinish.json", JSON.stringify(flatList));
  });

});
