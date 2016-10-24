'use strict';

var app = require('../..');
import request from 'supertest';

var bookRec, cloudRec, catRec;
var newRecId;
describe('Books API:', function() {


  describe('Query (Google), get /api/books', function() {
    beforeEach(function(done) {
      var qstring = '?' + 'title' + '=' + 'war and peace';
      request(app)
        .get('/api/books' + qstring)
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

    it('should have records with title, author, publisher, copywrite, description, image_url', function() {
      bookRec.should.have.keys('title', 'author', 'publisher', 'copywrite', 'description', 'image_url');
    });
  });

  describe('get /api/books/tag_cloud', function() {
    beforeEach(function(done) {
      // Need to create an image file 'touch ./cards/sample.jpg'
      request(app)
        .get('/api/books/tag_cloud')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          //cloudRec = JSON.parse(res.body);
          cloudRec = res.body;
          done();
        });
    });

    it('should be an array ', function() {
      cloudRec.should.be.instanceOf(Array);
    });
  });

  describe('get /api/books/tag', function() {
    beforeEach(function(done) {
      var qstring = '?id' + '=' + 'sharepoint';

      request(app)
        .get('/api/books/tag' + qstring)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          cloudRec = res.body;
          done();
        });
    });

    it('should be an array ', function() {
      cloudRec.should.be.instanceOf(Array);
    });
  });

  describe('get /api/books/categories', function() {
    beforeEach(function(done) {

      request(app)
        .get('/api/books/categories')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          cloudRec = res.body;
          done();
        });
    });

    it('should be an array ', function() {
      cloudRec.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/books/categories', function() {
    beforeEach(function(done) {

      request(app)
        .post('/api/books/categories')
        .send({
          name: "Test Category"
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          catRec = res.body;
          newRecId = catRec.id;
          done();
        });
    });

    it('should be an record with ID and Name ', function() {
      catRec.should.have.keys('id', 'name', 'created_at', 'updated_at');
      catRec.name.should.equal('Test Category');
    });
  });

});

describe('PUT /api/books/categories/$id', function() {
  it('should respond with 204 on successful update', function(done) {

    request(app)
    .put('/api/books/categories/' + newRecId)
    .send({
      name: "Newer Test Category"
    })
    .expect(204)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      catRec = res.body;
      done();
    });
  });


  it('should return get of the category', function(done) {

    request(app)
    .get('/api/books/categories/' + newRecId)
    .send()
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      catRec = res.body;
      done();
    });
  });

  it('should be an record with ID and Name ', function() {
    catRec.name.should.equal('Newer Test Category');
  });
});



describe('Delete /api/books/categories/$id', function() {
  it('should respond with 204 on successful removal', function(done) {
    request(app)
      .delete('/api/books/categories/' + newRecId)
      .expect(204)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('should respond with 404 when thing does not exist', function(done) {
    request(app)
      .delete('/api/books/categories/' + newRecId)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
