'use strict';
var fs = require("fs");
 var FindFiles = require("node-find-files");
 var path = require('path');

export function newCards(req, res) {
  console.log("-------------In newCards server --");
  //console.log("Request ==>\n" + JSON.stringify(req.body));

   var cardfiles = [];
   var processNewCard = function (strPath, stat) {
     if (stat.isDirectory()) {

     } else {
       if((path.extname(strPath) == ".jpg") || (path.extname == ".png")) {
           var rec = {
            'path' : path.dirname(strPath),
            'fname': path.basename(strPath);
           };
           cardfiles.push(rec);
       }
     }


   };
   // Get the last Date processed
   var lastDate = req.body.lastDate;
   var cardDir = "/cards";
   var finder = new FindFiles({
     rootFolder : cardDir,
     fileModifiedData : lastDate
   });

   finder.on("match", function(strPath, stat) {
       console.log(strPath + " - " + stat.mtime);
       processNewCard(strPath, stat);
   })
   finder.on("patherror", function(err, strPath) {
       console.log("Error for Path " + strPath + " " + err)  // Note that an error in accessing a particular file does not stop the whole show
   })
   finder.on("error", function(err) {
       console.log("Global Error " + err);
   })
   finder.on("complete", function() {
       console.log("Finished")
       fs.writeFile("server/public/carddirs.json", JSON.stringify(cardfiles));
       res.redirect(303, '/carddirs');
   })
   finder.startSearch();


    //console.log(JSON.stringify(theTrips));
  res.render('charity_report', theTrips);
}
