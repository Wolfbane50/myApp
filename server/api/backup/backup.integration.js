'use strict';

var app = require('../..');
import request from 'supertest';

var newBackup;
var testData = {
  name: "my backup",
  info: 'This is the brand new backup!!'
};
var testDataString = JSON.stringify(testData);

describe('Backup API:', function() {


  describe('POST /api/backups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/backups')
        .send({
          c2_data: testDataString,
          bkfile: 'myBackup'
        })
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBackup = res.text;
          //var bodyProps = "\n";
          //for(var i in res) {
          //  bodyProps += i + "\n"
        //  }
          //console.log('res.text -->' + res.text);
          //console.log('res properties --> ' + bodyProps);
          done();
        });
    });

    it('should respond with the backup file name', function() {
      newBackup.should.match(/^Data backed up to server\/public\/myBackup_\d\d\d\d\d\d_\d+\.bak/);

    });

    // it('should have created the backup file')
    // it('should have created the backup file with the correct content')
    // it('should have written the changes to the original json file')
    // Clean up the backup files
  });

});
