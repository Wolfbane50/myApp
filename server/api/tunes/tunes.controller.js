'use strict';
var fs = require("fs");
var FindFiles = require("node-find-files");
var path = require('path');

function isMusicFile(filePath) {
  var extensions = [".mp3", ".mp4", ".wma", ".flac", ".mpa"];
  for (var i = 0; i < extensions.length; i++) {
    if (path.extname(filePath) == extensions[i]) {
      return true;
    }
  }
  return false;
}

function findArchiveDate(albumRec, callback) {
  var latestDate = new Date(1, 1, 2000);
  var finder = new FindFiles({
    rootFolder: albumRec.directory,
    filterFunction: function(path, stat) {
      if (stat.isFile()) {
        return isMusicFile();
      } else {
        return false;
      }
    }
  });

  finder.on("match", function(strPath, stat) {
    //console.log(strPath + " - " + stat.mtime);
    var modDate = stat.mtime;
    if (modDate > latestDate) {
      latestDate = modDate;
    }
  });

  finder.on("complete", function() {
    albumRec.archived = latestDate;
    callback(null, albumRec);

  });
  finder.startSearch();

}

function filterDirectories(basePath, mapIter, mapDone) {
  fs.readdir(basePath, function(err, files) {
    async.filter(files, function(filepath, callback) {
      fs.stat(filepath, function(err, stats) {
        callback(null, stats.isDirectory());
      });
    }, function(err, results) {
      async.map(results, function(filepath, callback) {
        mapIter(filepath, callback);
      }, mapDone);
    });
  });
}

function findAlbums(artistRec, ArCallback) {
  filterDirectories(artistRec.directory, function(filepath, callback) {
    var newAlbum = {
      directory: filepath,
      name: path.basename(filepath),
      artist: artistRec.name
    };
    findArchiveDate(newAlbum, callback);

  }, function(err, results) {
    artistRec.albums = results;
    ArCallback(null, artistRec);
  });

}

function saveTunesFile(theTunes) {
  fs.writeFile("server/public/mytunes.json", JSON.stringify(theTunes));

}

// tunes/search/
export function albumSearch(req, res) {
  var tunesBaseDir = "Multimedia/My Music";

  // Blank database to start
  var tunesCollection = {
    baseDir: tunesBaseDir,
    artists: []
  };

  filterDirectories(tunesBaseDir, function(filepath, callback) {
    var newArtist = {
      directory: artistDir,
      name: path.basename(artistDir),
      albums: []
    };
    findAlbums(newArtist, callback);

  }, function(err, results) {
    tunesCollection.artists = results;
    saveTunesFile(tunesCollection);
    res.redirect(303, '/tunes/');
  });

  // Write out tunesCollection to a file

}

//  /tunes/
export function index(req, res) {
  res.sendFile("server/public/mytunes.json", function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent:', fileName);
    }
  });
}

//  /tunes/update
export function updateTunes(req, res) {
  console.log("-------------In tunes server --");
  // Why do I need this?

}
