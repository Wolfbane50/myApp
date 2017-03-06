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
  var vidType = {};
  var convCount = 0;
  console.log("Y:");

  audData = JSON.parse(content.toString());
  audData.forEach(function(drElement, index, array) {

    var items = drElement.items;
    items.forEach(function(element, index, array) {
      //console.log("Working on " + element.Title)
      if(element.SPath.match(/^TV Shows/)) {
        element.SPath = 'http://NASD9760C/' + element.SPath;
      }

      var dirChanged = false;
      var localPath = element.SPath.replace(/http:\/\/NASD9760C\//, 'Y:/');
      localPath = localPath.replace(/\//g, "\\");
      var chdir = "cd \"" + localPath + "\"";


      if ((element.episodes) && (element.episodes.length)) {
        element.episodes.forEach(function(ep, epIndex, epArray) {
          var fname = ep.fname;
          //var exts = fname.match(/\.*+$/);
          var ext = fname.substr(fname.lastIndexOf('.'));

          if ((ext == ".mp4") || (ext == ".m4v")) {
          } else {
            convCount++;
            vidType[ext] = true;

            if(! dirChanged) {
              console.log(chdir);
              dirChanged = true;
            }
             var outfile = fname.replace(ext, ".mp4");
             var outfile = outfile.replace(/\(/g, '');
             var outfile = outfile.replace(/\)/g, '');

//             console.log("'C:\\Program Files\\Handbrake\\HandBrakeCLI' -i '" + fname + "' -o '" + outfile +"'");
             console.log('C:\\ffmpeg-20160310-git-66edd86-win64-static\\bin\\ffmpeg -i "' + fname + '" " ' + outfile + '"');

             ep.fname = outfile;
            //if (!((ext == ".avi") || (ext ==".mkv"))) {
            //  console.log(element.SPath + '/' + fname);
            //}

          }
        });
      }

    });



  });
  //console.log("Must convert " + convCount + " videos!");
  //console.log("Video Types: " +  Object.keys(vidType).join('-'));

  fs.writeFile("server/public/new_drwho_tv_tree.json", JSON.stringify(audData));
});
