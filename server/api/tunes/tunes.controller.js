'use strict';

//  Server Side contorller to manage a database of metadata on music in a directory structure
//     Directory Structure:
//        Base
//          - Artists (d)
//          -    Albums (d)
//                  - <subdirectories> (d) Optional
//                       Music Files (.mp3, .flac, etc.)

var fs = require("fs");
var FindFiles = require("node-find-files");
var path = require('path');
var async = require('async');

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
  //console.log("Finding Archive date for " + albumRec.directory);
  var latestDate = new Date(2000, 0, 1);
  //console.log("LatestDate is " + latestDate.toString());
  var finder = new FindFiles({
    rootFolder: albumRec.directory,
    filterFunction: function(path, stat) {
      if (stat.isFile()) {
        return isMusicFile(path);
      } else {
        return false;
      }
    }
  });

  finder.on("match", function(strPath, stat) {
    //console.log(strPath + " - " + stat.mtime);
    var modDate = stat.mtime;
    if (modDate > latestDate) {
      //console.log("Updating latest Date to " + modDate.toString());
      latestDate = modDate;
    }
  });

  finder.on("complete", function() {
    albumRec.archived = latestDate;
    callback(null, albumRec);

  });
  finder.startSearch();

}

// filterDirectories : Wrapper around async.filter to find only subdirectories and
//    call client operations for each entry and upon completion.
// Note: Using old (v1.5) async for async.filter - API changes for later versions
//       Changes for newer API are commented out.
function filterDirectories(basePath, mapIter, mapDone) {
  console.log("filterDirectories called on basePath: " + basePath);
  fs.readdir(basePath, function(err, files) {
    async.filter(files, function(filepath, callback) {
      var fullpath = basePath + '/' + filepath;
      fs.stat(fullpath, function(err, stats) {
        if (err) {
          console.log("Got error from stat!");
        }
        //console.log("Checking for is directory of filepath " + filepath)
        //console.log("------ " + stats.isDirectory());
        //  callback(null, stats.isDirectory());
        return callback(stats.isDirectory());
      });
      //  }, function(err, results)
    }, function(results) {

      //      console.log("Finished filter - " + JSON.stringify(results));
      if (results.length) {
        async.map(results, function(filepath, callback) {
          //console.log("Calling mapIter on " + filepath);
          mapIter(filepath, callback);
        }, mapDone);
      } else {
        mapDone(null, []);
      }
    });
  });
}

function findAlbums(artistRec, ArCallback) {
  //console.log("Find Albums in " + artistRec.directory);
  filterDirectories(artistRec.directory, function(filepath, callback) {
    //console.log("Found Album " + filepath);
    var newAlbum = {
      directory: artistRec.directory + '/' + filepath,
      name: filepath,
      artist: artistRec.name
    };
    findArchiveDate(newAlbum, callback);

  }, function(err, results) {
    console.log("Done albums for " + artistRec.name);
    artistRec.albums = results;
    ArCallback(null, artistRec);
  });

}

function saveTunesFile(theTunes) {
  fs.writeFile("server/public/mytunes.json", JSON.stringify(theTunes));

}

// GET /api/tunes/search
//   Will create music database from scratch
export function albumSearch(req, res) {
  //var tunesBaseDir = "Multimedia/My Music";
  var tunesBaseDir = req.query.directory;
  console.log("Starting album search in " + tunesBaseDir);

  // Blank database to start
  var tunesCollection = {
    baseDir: tunesBaseDir,
    artists: []
  };

  filterDirectories(tunesBaseDir, function(filepath, callback) {
    var newArtist = {
      directory: tunesBaseDir + '/' + filepath,
      name: filepath,
      albums: []
    };
    findAlbums(newArtist, callback);

  }, function(err, results) {
    tunesCollection.artists = results;
    saveTunesFile(tunesCollection);
    res.redirect(303, '/tunes');
  });

  // Write out tunesCollection to a file

}

//  GET /api/tunes
//    Just redirect to JSON file
export function index(req, res) {
  //console.log("Inside index");
  res.redirect(303, '/mytunes.json');
  //res.sendFile("server/public/mytunes.json", function(err) {
  //  if (err) {
  //    console.log("Error sending file " + err.message);
  //    res.status(err.status).end();
  //  } else {
  //    console.log('Sent:', fileName);
  //  }
  //});
}

function getTunesFile() {
  // Synchrounsly read the file since we cannot do anything without it
  try {
    var buf = fs.readFileSync("server/public/mytunes.json");
    return JSON.parse(buf.toString());
  } catch (err) {
    console.error("Could not read JSON file : " + err);
    return null;
    // What to return???
  }

}

// For a given artist, find all changed albums (new, deleted) and update
function updateArtistAlbums(artistRecord, ArCallback) {
  // Create hash of albums
  var albumHash = createHash(artistRecord.albums);

  filterDirectories(artistRecord.directory, function(filepath, callback) {
    // Iterator for each album
    var fullpath = artistRecord.directory + '/' + filepath;
    if (albumHash[fullpath]) {
      albumHash[fullpath].found = true;
      findArchiveDate(albumHash[fullpath].recRef, callback);
    } else {
      var newAlbum = {
        directory: fullpath,
        name: filepath,
        artist: artistRecord.name
      };
      artistRecord.albums.push(newAlbum);
      findArchiveDate(newAlbum, callback);
    }
  }, function(err, results) {

    deleteRecords(albumHash, artistRecord.albums, function() {
      ArCallback(null, artistRecord);
    });


  });

}

function deleteRecords(theHash, theArray, delCallback) {
  var deleteIndices = [];
  async.forEachOf(theHash, function(descriptor, key, callback) {
    //for (var artist in artistHash) {
    if (!descriptor.found) {
      deleteIndices.push(descriptor.index);
    }
    callback();
  }, function(err) {
    // Needs to be run when all complete
    deleteIndices.sort(function(a, b) {
      return b - a;
    }); // Reverse sort numerically
    for (var i = 0; i < deleteIndices.length; i++) {
      theArray.splice(deleteIndices[i], 1);
    }
    if (delCallback) {
      delCallback();
    }
  });

}

// Build a hash with key directory name and values
//     found - If a match found with database and directory structure
//     recRef - Reference to the actual metadata for this directory
//     index - Index into array of records.  Will be used in deletion
function createHash(theArray) {
  console.log("Creating hash for array");
  var theHash = {};
  for (var i = 0; i < theArray.length; i++) {
    var theRec = theArray[i];
    console.log("building hash entry for " + theRec.directory);
    theHash[theRec.directory] = {
      found: false,
      recRef: theRec, // Reference to the real record
      index: i
    }
  }
  return theHash;
}

//  POST /api/tunes/update
export function updateTunes(req, res) {
  console.log("-------------In tunes server --");
  // Why do I need this? - Need it to synchronize edited changes from client with
  //    updates to file system - Names of artists and albums will change from client
  //
  //  Assumptions:
  //     1. Client GUI will only update meta-data: names plus additional attributes.
  //     2. Client will not add or remove any artists or albums
  //     3. Server is resposible for directories which reflect the current filesystem.
  //
  //  Design:
  //     1. Find Added Artists by walking the directory and comparing to DB
  //           Mark artists as new
  //           Add all Albums to new Artist
  //     2. Find deleted Artitsts by walking DB and finding any missing entries
  //           Delete artists from database
  //     3. For each existing artist
  //           i. Find added albums
  //           ii. Find deleted albums
  //           ii. For each existing albums
  //                - Update archived date
  var tunesBaseDir = req.query.directory;
  console.log("Starting album search in " + tunesBaseDir);

  // load our database of existing artists/albums
  var tunesCollection = getTunesFile();
  if (!tunesCollection) {
    console.log('Cannot open music database!');
    res.send(500, 'Cannot open music database!');
    return;
  }
  console.log("Got data");


  // Verify we are looking at the same filesystem
  if (tunesBaseDir != tunesCollection.baseDir) {
    res.send(500, 'Database does not match input path for music!');
    console.log("Database does not match input path for music!");
    return;
  }
  //console.log(JSON.stringify(tuneCollection));

  // Build a hash of existing artists
  console.log("Building hash of artists");
  var artistHash = createHash(tuneCollection.artists);

  // Find and Add new artists
  console.log("Filter directories for artists");
  filterDirectories(tunesBaseDir, function(filepath, callback) {
    // Iterator - run on each artist directory
    var fullpath = tunesBaseDir + '/' + filepath;
    if (artistHash[fullpath]) {
      artistHash[fullpath].found = true;
      updateArtistAlbums(artistHash[fullpath].recRef, callback);
    } else {
      // New artist
      var newArtist = {
        directory: fullpath,
        name: filepath,
        albums: []
      };
      // Add artist to the database
      tuneCollection.artists.push(newArtist);

      // Get all the albums for the new artist
      findAlbums(newArtist, callback);

    }

  }, function(err, results) {
    // results contains list of all artists, but I don't really care since databse was updated

    // Walk the hash to find any deleted artists
    deleteRecords(artistHash, tunesCollection.artists, function() {
      // Write out the database
      saveTunesFile(tunesCollection);
      // Redirect to /theTunes
      res.redirect(303, '/tunes');
    });
  });
}
