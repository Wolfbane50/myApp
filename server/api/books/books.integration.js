'use strict';

var app = require('../..');
import request from 'supertest';

var bookRec;
describe('Books Query (Google) API:', function() {


  describe('get /api/books', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/books')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bookRec = res.body;

          done();
        });
    });

    // Clean up files aftereward

//    it('should respond with a JSON object', function() {
//      bookRec.should.be.instanceOf(object);
//    });

    it('should have records with name and id', function() {
      bookRec.should.have.keys('title', 'author', 'publisher', 'copywrite', 'description', 'image_url');
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
