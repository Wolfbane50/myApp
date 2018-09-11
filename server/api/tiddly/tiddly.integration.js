'use strict';

var app = require('../..');
import request from 'supertest';
import touch from 'touch';
import fse from 'fs-extra'; // Used for copy, move of files

describe('Tiddly API:', function() {

  describe('PUT /api/tiddly', function() {
    it('should respond with 200 on successful update', function(done) {

      request(app)
        .put('/api/tiddly')
        .send({
          root: "ffg_notes",
          destination: "C:/Users/daniel.heaney/Documents/Frigate"
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          catRec = res.body;
          done();
        });
    });

    it('should have moved source file to destination ', function() {

    });
  });

});
