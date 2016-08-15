var fs = require('fs');

var audConfig = "server/public/ss_cards.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {}; // Hash of all unique titles

fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  //console.log(content.toString().substr(1, 8));

  audData = JSON.parse(content.toString());
  audData.forEach(function(cardSets, index, array) {
      cardSets.cards.forEach(function(element, index, array) {
        //console.log("Working on " + element.Title)
        if (element.link) {
          element.fname = element.link.replace(/cards\/\.\//, '');
          console.log("Set card.fname to " + element.fname);
          delete element.link;
        }
      });
  }); fs.writeFile("server/public/new_ss_cards.json", JSON.stringify(audData));
});
