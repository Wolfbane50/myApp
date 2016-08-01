var fs = require('fs');

var audConfig = "server/public/bigFinish.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {};  // Hash of all unique titles

fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  //console.log(content.toString().substr(1, 8));

  audData = JSON.parse(content.toString().substr(1));
  audData.forEach(function(element, index, array) {
    //console.log("Working on " + element.Title)
    var series = element.Series;
    var title = element.Title;
    if (titles[title]) {
      console.log("Eliminating " + series + " - " + title);
    } else {
       titles[title] = 1;
       filteredList.push(element);
    }
  });
  fs.writeFile("server/public/newbigFinist.json", JSON.stringify(filteredList));
});
