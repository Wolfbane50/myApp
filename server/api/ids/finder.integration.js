'use strict';

var app = require('../..');

import request from 'supertest';
var results;

describe('IDS Finder API:', function() {


  describe('GET /api/ids', function() {
    beforeEach(function(done) {
      var qstring = '?term' + '=' + '35435';
      request(app)
        .get('/api/ids' + qstring)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
            results = res.body;
          //var bodyProps = "\n";
          //for(var i in res) {
          //  bodyProps += i + "\n"
        //  }
          //console.log('res.text -->' + res.text);
          //console.log('res properties --> ' + bodyProps);
          done();
        });
    });

    afterEach(function() {

    });


    it('should return an array of search results', function() {
         results.should.be.instanceOf(Array);
    });

    it('should return results in the correct format', function() {
        results.should.have.keys('dir', 'doc');
    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')
    // Clean up the backup files
  });

});
