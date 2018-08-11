'use strict';
var fs = require("fs");

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

var start = "y:/photos/";

for (var yr=1996; yr<2019; yr++) {
  var yrdir = start + yr;
  fs.mkdir(yrdir, function(err) {
    if(err) {
      console.log("Could not create dir " +  yrdir);
      return;
    }
    for (var i=0; i<months.length; i++) {
      var mon = months[i];
      console.log("mkdir " + yrdir + "/" + mon);
      fs.mkdirsync(yrdir + "/" + mon);
    }
  });
}
