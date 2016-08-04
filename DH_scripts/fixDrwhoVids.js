var fs = require('fs');

var audConfig = "server/public/drwho_tv_tree.json";
//var audConfig = "server/public/bunt.json";

var filteredList = [];
var titles = {}; // Hash of all unique titles

fs.readFile(audConfig, function(err, content) {
  if (err) {
    console.log('Could not read JSON file ' + audConfig + ": " + err);
    return;
  }
  console.log(content.toString().substr(0, 8));

  audData = JSON.parse(content.toString());
  audData.forEach(function(drElement, index, array) {

    var items = drElement.items;
    items.forEach(function(element, index, array) {
      //console.log("Working on " + element.Title)
      if (element['S-Path']) {
        element.SPath = element['S-Path'];
        delete element['S-Path'];
      }

      if (element.Released) {
        if (typeof element.Released == "string") {
          // Convert ISO 8601 Date string representation ("1999-07-01T00:00:00.000Z") to Javascript Date Object
          //console.log("Converting date from ISO string to object...");
          var dtstr = element.Released.replace(/\D/g, " ");
          var dtcomps = dtstr.split(" ");
          dtcomps[1]--;
          element.Released = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
        } else {

          if (typeof element.Released == "number") {
            // Convert from Excel Date Format,
            //    excel - number of days since Dec 31, 1899
            //    javascript - number of milliseconds since Jan 1, 1970
            //    70 years * 365.25 days  ==> pretty close to 25569
            //console.log("Converting date from excel format to Javascript...");
            var real_utc_days = element.Released - 25569;
            if (real_utc_days > 0) {
              var utc_days = Math.floor(element.Released - 25569);
              var utc_value = utc_days * 86400;
              element.Released = new Date(utc_value);
            } else {
              var exc_year = Math.floor(element.Released / 365) + 1900;
              var exc_yday = element.Released % 365;

              //console.log("Excel date: " + element.Released);
              var mtot = 0;
              var idx = 0;
              var mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
              var exc_date = 1;
              while ((idx < mdays.length) && (exc_yday > mtot)) {
                mtot += mdays[idx];
                idx++;
              }
              var exc_mon = idx - 1;
              //console.log("Day in year = " + exc_yday + "\nSetting Date to " + exc_mon + '/'+ exc_date + '/' + exc_year)
              element.Released = new Date(exc_year, exc_mon, exc_date);
            }
          } else {
            alert("Unknown format for release date of " + element.name + " : " + element.Released);
            throw ("Database format Error");
          }
        }
      }

      // Remove links from episodes
      if ((element.episodes) && (element.episodes.length)) {
        element.episodes.forEach(function(ep, epIndex, epArray) {
          if (ep.link) {
            delete ep.link
          }
        });
      }

    });



  });
  fs.writeFile("server/public/new_drwho_tv_tree.json", JSON.stringify(audData));
});
