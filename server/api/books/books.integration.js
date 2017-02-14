'use strict';

var app = require('../..');
import request from 'supertest';
import touch from 'touch';
import fse from 'fs-extra'; // Used for copy, move of files
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
      //console.log("bookRec keys => " + JSON.stringify(Object.keys(bookRec)));
      bookRec.should.have.keys('title', 'author', 'copywrite', 'description', 'image_url');
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

  describe('get /api/books/tagsForDoc', function() {
    beforeEach(function(done) {
      var qstring = '?id' + '=' + '367';

      request(app)
        .get('/api/books/tagsForDoc' + qstring)
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

describe('get /api/books/loadstage', function() {
  beforeEach(function(done) {
    var qstring = '?stage_directory' + '=' + 'C:/Users/daniel.heaney/Documents/ebooks';
    request(app)
      .get('/api/books/loadstage' + qstring)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        cloudRec = res.body;
        done();
      });
  });
  it('should be an array ', function() {
    cloudRec.items.should.be.instanceOf(Array);
    cloudRec.items.length.should.be.greaterThan(0);
    cloudRec.items[0].should.have.keys( 'name', 'title' );
  });

});

var fnames = [
  "CoffeeScript Quick Ref.pdf",
  "coffeescript-trevor-burnham.pdf",
  "Doctor Who_ The Legends of Ashildr - Justin Richards.epub"
];
var myDocs = [
  {
    "title": "Book1",
    "author": "Roseanne Roseannadanna",
    "image_url": "http://localhost:3000/assets/document.gif",
    "category_id": 10,
    "type_id": 1,
    "url": fnames[0],
    "publisher": "WBANE",
    "copywrite": "2008-02-21",
    "description": "This record is part of integration testing and may be deleted."
  }, {
    "title": "Book2",
    "author": "John Jacob Dingleberry Schmidt",
    "image_url": "http://localhost:3000/assets/document.gif",
    "category_id": 10,
    "type_id": 1,
    "url": fnames[1],
    "publisher": "WBANE",
    "copywrite": "2008-02-21",
    "description": "This record is part of integration testing and may be deleted."
  }, {
    "title": "Book3",
    "author": "Biggus Dickus",
    "image_url": "http://localhost:3000/assets/document.gif",
    "category_id": 10,
    "type_id": 1,
    "url": fnames[2],
    "publisher": "WBANE",
    "copywrite": "2008-02-21",
    "description": "This record is part of integration testing and may be deleted."

  }
];

describe('get /api/books/savestage', function() {
  //var stageDir = 'C:/Users/daniel.heaney/Documents/ebooks';
//  var stageDir = 'C:/Users/Daniel/myapp/server/api/books/test_stage_dir';
//  var targetDir = 'C:/Users/Daniel/myapp/server/api/books/test_dest_dir';
  var stageDir = './server/api/books/test_stage_dir';
  var targetDir = './server/api/books/test_dest_dir';

  beforeEach(function(done) {
    // Move files back from storage to savestage
    //      Assume if it doesnt work that they are in stageDir
    try {
      fse.emptyDirSync(targetDir);
    } catch(e) {
      console.log(e.message);
      return done(e);
    }
    for (var i=0; i<fnames.length; i++) {
      var src = stageDir + "/" + fnames[i];
      try {
        touch.sync(src);
      } catch(e) {
        console.log("Error touching fnames[i]: " + e.message);
        return done(e);
      }
    }
    request(app)
      .post('/api/books/savestage')
      .send({
        stage_directory: stageDir,
        target: targetDir,
        documents: myDocs
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log("We FAILED...." + err + "\nresp => " + JSON.stringify(res.status));
          return done(err);
        }

        cloudRec = res.body;
        done();
      });
  });
  it('should return a structure indicating success ', function() {
    cloudRec.overallStatus.should.be.true
    cloudRec.docStatus.should.be.instanceOf(Array);
    cloudRec.docStatus.length.should.be.greaterThan(0);

  });

});
describe('get /api/books/movestage', function() {
  //var stageDir = 'C:/Users/daniel.heaney/Documents/ebooks';
//  var stageDir = 'C:/Users/Daniel/myapp/server/api/books/test_stage_dir';
//  var targetDir = 'C:/Users/Daniel/myapp/server/api/books/test_dest_dir';
  var stageDir = './server/api/books/test_stage_dir';
  var targetDir = './server/api/books/test_dest_dir';

  beforeEach(function(done) {
    // Move files back from storage to savestage
    //      Assume if it doesnt work that they are in stageDir
    try {
      fse.emptyDirSync(targetDir);
    } catch(e) {
      console.log(e.message);
      return done(e);
    }
      var src = stageDir + "/" + fnames[0];
      try {
        touch.sync(src);
      } catch(e) {
        console.log("Error touching fnames[0]: " + e.message);
        return done(e);
      }

    request(app)
      .post('/api/books/movestage')
      .send({
        stage_directory: stageDir,
        target: targetDir,
        document: myDocs[0]
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log("We FAILED...." + err + "\nresp => " + JSON.stringify(res.status));
          return done(err);
        }

        cloudRec = res.body;
        done();
      });
  });
  it('should return a structure indicating success ', function() {
    cloudRec.overallStatus.should.be.true
    cloudRec.docStatus.should.be.instanceOf(Array);
    cloudRec.docStatus.length.should.be.greaterThan(0);

  });
  targetDir = "./blah";

});


  var redirect, redirectUrl;
describe('get /api/books/publishers', function() {
  beforeEach(function(done) {

    request(app)
      .get('/api/books/publishers')
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

  it('should return an array of strings', function() {
    cloudRec.should.be.instanceOf(Array);
    var myPub = cloudRec[0];
    myPub.should.be.a.String;

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
    .expect(200)
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

  describe('get /api/books/documents', function() {
    beforeEach(function(done) {

      request(app)
        .get('/api/books/documents')
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

  describe('POST /api/books/documents', function() {
    beforeEach(function(done) {

      request(app)
        .post('/api/books/documents')
        .send({
          authenticity_token: 'ubZSUcBiMemqZi06YTAEhxEL4NO9CDUdyyyGFpKYdYM=',
          document: {
          title: "New Book",
          author: "New Author",
          publisher: "New Publisher",
          image_url: "http://localhost:3000/assets/document.gif",
          type_id: 1,
          category_id: 10,
          tag_list: "test1, test2",
          url: "http://mybook.com/book1.epub"
        }})
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            console.log("We FAILED...." + err);
            return done(err);
          }

          catRec = res.body;
          newRecId = catRec.id;
          done();
        });
    });

    it('should be an record with ID, title, etc ', function() {
      catRec.should.have.keys('id', 'title', 'author', 'publisher', 'image_url', 'type_id', 'category_id', 'url', 'created_at', 'updated_at', 'copywrite', 'description', 'tag_id');
      catRec.title.should.equal('New Book');
    });
  });

});

describe('PUT /api/books/documents/$id', function() {
  it('should respond with 204 on successful update', function(done) {

    request(app)
    .put('/api/books/documents/' + newRecId)
    .send({
      document: {
         title: "Newer Book"
       }
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


  it('should return get of the document', function(done) {

    request(app)
    .get('/api/books/documents/' + newRecId)
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
    catRec.title.should.equal('Newer Book');
  });
});



describe('Delete /api/books/documents/$id', function() {
  it('should respond with 204 on successful removal', function(done) {
    request(app)
      .delete('/api/books/documents/' + newRecId)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('should respond with 404 when thing does not exist', function(done) {
    request(app)
      .delete('/api/books/documents/' + newRecId)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('Play with Documents API to get tags working', function() {
  it('should respond with 204 on successful update', function(done) {
    newRecId = 400;   // web dev/Ajax and REST recipes
    request(app)
    .put('/api/books/documents/' + newRecId)
    .send({
      document: {
        tag_list: "ajax, REST"
       }
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

});
