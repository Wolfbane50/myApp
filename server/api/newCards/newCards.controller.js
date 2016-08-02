'use strict';
var fs = require("fs");
 var FindFiles = require("node-find-files");
 var path = require('path');

export function index(req, res) {
  console.log("-------------In newCards server --");
  //console.log("Request ==>\n" + JSON.stringify(req.body));

   var cardfiles = [];
   var cardDir = "./server/public/cards";
   var pubDir = "server/public/";
   var processNewCard = function (strPath, stat) {
     if (stat.isDirectory()) {

     } else {
       console.log("Adding " + strPath);
       if((path.extname(strPath) == '.jpg') || (path.extname(strPath) == '.png')) {
           var trimpath = path.dirname(strPath);
           // Strip the public directory particular
           //console.log("trimpath: " + trimpath + "  pubDir: " + pubDir + " with lenght: " + pubDir.length);
           trimpath = trimpath.substr(pubDir.length);
           var re = /\\/g;
           trimpath = trimpath.replace(re, '/');
           //console.log("trimpath: " + trimpath);
           var rec = {
            'path' : trimpath,
            'fname': path.basename(strPath)
           };
           //console.log('Pushing into cardfiles');
           cardfiles.push(rec);
       }
     }


   };
   // Get the last Date processed
   var lastDateStr = req.body.lastDate;
   var dtstr = req.body.lastDate.replace(/\D/g," ");
   var dtcomps = dtstr.split(" ");
   dtcomps[1]--;
   var lastDate = new Date(Date.UTC(dtcomps[0],dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));

   var finder = new FindFiles({
     rootFolder : cardDir,
     fileModifiedDate : lastDate
   });

   finder.on("match", function(strPath, stat) {
       //console.log(strPath + " - " + stat.mtime);
       processNewCard(strPath, stat);
   })
   finder.on("patherror", function(err, strPath) {
       console.log("Error for Path " + strPath + " " + err)  // Note that an error in accessing a particular file does not stop the whole show
   })
   finder.on("error", function(err) {
       console.log("Global Error " + err);
   })
   finder.on("complete", function() {
       console.log("Finished");
       if(cardfiles.length) {
          fs.writeFile("server/public/carddirs.json", JSON.stringify(cardfiles));
      } else {
          console.log("No new files discovered!");
      }
       res.redirect(303, '/carddirs');
   })
   finder.startSearch();

}
