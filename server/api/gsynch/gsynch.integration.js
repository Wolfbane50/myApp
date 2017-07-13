'use strict';

var app = require('../..');
import request from 'supertest';


var redirect, redirectUrl;
var respStruct;
describe.only('gsynch API:', function() {


  describe('post /api/gsynch  with valid file', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .post('/api/gsynch')
        .send({
          gid: '0B-SU-eAGCKuiNC1TdVRnUXF3TUUtT2doMEpJU0tPR1hSS1RB',
          path: "C:\\Users\\daniel.heaney\\Documents\\jan_planning.xlsx"
        })
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            console.log("Got error and response : " + res.text);
            return done(err);
          }
          respStruct = res.body;
          done();
        });
    });

    // Clean up files aftereward
    it('should return an array of strings', function() {
      respStruct.should.be.a.String;
    });

  });
  describe('post /api/gsynch with bad path', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .post('/api/gsynch')
        .send({
          gid: 0,
          path: "C:\\Users\\daniel.heaney\\Documents"
        })
        .expect(400)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            console.log("Got error and response : " + res.text);
            return done(err);
          }
          respStruct = res.text;
          done();
        });
    });

    // Clean up files aftereward
    it('should return error message', function() {
      respStruct.should.be.a.String;
      respStruct.should.contain('File to be synched is not a file');
    });

  });
  describe('post /api/gsynch with directory instead of file', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .post('/api/gsynch')
        .send({
          gid: 0,
          path: "guckum"
        })
        .expect(400)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            console.log("Got error and response : " + res.text);
            return done(err);
          }
          respStruct = res.text;
          done();
        });
    });

    // Clean up files aftereward
    it('should return error message', function() {
      respStruct.should.be.a.String;
      respStruct.should.contain('Cannot get status of file to be synched:');
    });

  });

});
