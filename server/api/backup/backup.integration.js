'use strict';

var app = require('../..');
import request from 'supertest';

var newBackup;

describe('Backup API:', function() {

  describe('GET /api/backups', function() {
    var backups;

    beforeEach(function(done) {
      request(app)
        .get('/api/backups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          backups = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      backups.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/backups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/backups')
        .send({
          name: 'New Backup',
          info: 'This is the brand new backup!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBackup = res.body;
          done();
        });
    });

    it('should respond with the newly created backup', function() {
      newBackup.name.should.equal('New Backup');
      newBackup.info.should.equal('This is the brand new backup!!!');
    });

  });

  describe('GET /api/backups/:id', function() {
    var backup;

    beforeEach(function(done) {
      request(app)
        .get('/api/backups/' + newBackup._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          backup = res.body;
          done();
        });
    });

    afterEach(function() {
      backup = {};
    });

    it('should respond with the requested backup', function() {
      backup.name.should.equal('New Backup');
      backup.info.should.equal('This is the brand new backup!!!');
    });

  });

  describe('PUT /api/backups/:id', function() {
    var updatedBackup;

    beforeEach(function(done) {
      request(app)
        .put('/api/backups/' + newBackup._id)
        .send({
          name: 'Updated Backup',
          info: 'This is the updated backup!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBackup = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBackup = {};
    });

    it('should respond with the updated backup', function() {
      updatedBackup.name.should.equal('Updated Backup');
      updatedBackup.info.should.equal('This is the updated backup!!!');
    });

  });

  describe('DELETE /api/backups/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/backups/' + newBackup._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when backup does not exist', function(done) {
      request(app)
        .delete('/api/backups/' + newBackup._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
