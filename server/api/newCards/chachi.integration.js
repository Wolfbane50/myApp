'use strict';

var app = require('../..');
import request from 'supertest';

var redirect, redirectUrl;
describe('Chachi API:', function() {


  describe('get /api/newCards/chachi', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/newCards/chachi')
        .send()
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

    it('should respond with redirect to /chachis3.json', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/chachis3.json');

    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')

  });

  describe('post /api/newCards/chachi', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .post('/api/newCards/chachi')
        .send()
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

    it('should respond with redirect to /chachis3.json', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/chachis3.json');

    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')

  });


});
