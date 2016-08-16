'use strict';

var app = require('../..');
var fs = require('fs');
var unzip = require('unzip');
import request from 'supertest';
const

var s_path = "server/public/";
var jsonFile = s_path + "mytunes.json";

var redirect, redirectUrl;

describe('Tunes API:', function() {

  before(function() {
     // runs before all tests in this block
     var jsonStats = fs.statSync(jsonFile);
     if (jsonStats.isFile()) {
       var backupFN = jsonFile.repl(/\.json$/, '.bak');
       fs.rename(jsonFile, backupFN);
     }

     // Create the test data
     //fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));
     fs.createReadStream('server/api/tunes/testdata.zip').pipe(unzip.Extract({ path: '/blah' }));

   });

  after(function() {
    // Restore the JSON file if needed
     var backupFN = jsonFile.repl(/\.json$/, '.bak');
    var backStats = fs.statSync(backupFN);
    if (backStats.isFile()) {
        fs.rename(backupFN, jsonFile);
    }

    // Delete the test data.
    del('/blah/music/**');
  });

  describe('get /api/tunes', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/tunes')
        .send()
        .expect(303)
        .expect('Content-Type',  /text/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          redirect = res.redirect;
          redirectUrl = res.headers.location;
          done();
        });
    });

    // Clean up files aftereward

    it('should redirect to /mytunes.json', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/mytunes.json');
    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')

  });
  describe('GET /api/tunes/search', function() {
    var things;
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/tunes/search')
        .query({directory: '/blah/music'})
        .expect(303)
        .expect('Content-Type',  /text/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          redirect = res.redirect;
          redirectUrl = res.headers.location;

          done();
        });
    });

    it('should respond with redirect to /tunes', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/tunes');

    });

    // it('should write out mytunes.json based on sample data')


  });

//////////////////////////////////////////
// More comprehensive integration
//////////////////////////////////////////
// Buildup
//   Backup existing mytunes.json
//   (Test Music Directory should be in default state)
//   (Music Backup directory should have some additional files)

// Do search from scratch
// Verify mytunes.json is correct

// Make mods to music directories
//     Add an artist
//     Delete an artist or two
//    Add an album to an artist
//     Delete an album from an artist
//    Change the name of an album - should delete old and add new
//    Touch a music file in a non-changing artist/album and verify archive time updates

// Teardown
//   Restore Test Music Directory to original state
//   Restore mytunes.json
});
