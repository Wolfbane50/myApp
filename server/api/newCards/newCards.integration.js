'use strict';

var app = require('../..');
import request from 'supertest';

var yesterday = new Date();
//yesterday.setDate(yesterday.getDate() - 1);
// Temp fix - Go back to May, so subtract 30+31+30
yesterday.setDate(yesterday.getDate() - 91);

var redirect, redirectUrl;
var testData = {
  name: "my backup",
  info: 'This is the brand new backup!!'
};
var testDataString = JSON.stringify(testData);

describe('New Cards API:', function() {


  describe('get /api/newCards', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/newCards')
        .send({
          lastDate: yesterday
        })
        .expect(303)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
//          console.log('headers = ' + res.headers.location);
          redirect = res.redirect;
          redirectUrl = res.headers.location;
          done();
        });
    });

    // Clean up files aftereward

    it('should respond with redirect to /carddirs', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/carddirs');

    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')

  });

});
