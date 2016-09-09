'use strict';

var app = require('../..');
import request from 'supertest';

var redirect, redirectUrl;
describe('Bunt API:', function() {


  describe('get /api/newCards/bunt', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/newCards/bunt')
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

    it('should respond with redirect to /bunt.json', function() {
      redirect.should.be.true;
      redirectUrl.should.equal('/bunt.json');

    });
  });

  describe('get /api/newCards/drive', function() {
    var matrix;
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/newCards/drive')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          matrix = res.body;
          done();
        });
    });

    // Clean up files aftereward
      console.log("*** /drive returned:  " + JSON.stringify(matrix));

    it('should respond with a JSON array', function() {
      matrix.should.be.instanceOf(Array);
    });

    it('should have records with name and id', function() {
      matrix[0].should.have.keys('name', 'id');
    });
  });

//  describe('post /api/newCards/bunt', function() {
//    beforeEach(function(done) {
//      // Need to create an image file 'touch ./cards/sample.jpg'
//      request(app)
//        .post('/api/newCards/bunt')
//        .send()
//        .expect(303)
//        .expect('Content-Type', /text/)
//        .timeout(100000)
//        .end((err, res) => {
//          if (err) {
//            return done(err);
//          }
//          console.log('headers = ' + res.headers.location);
//          redirect = res.redirect;
//          redirectUrl = res.headers.location;
//          done();
//        });
//    });

    // Clean up files aftereward

//    it('should respond with redirect to /bunt.json', function() {
//      redirect.should.be.true;
//      redirectUrl.should.equal('/bunt.json');

//    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')

//  });


});
