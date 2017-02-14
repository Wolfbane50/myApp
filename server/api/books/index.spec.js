'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var booksCtrlStub = {
  query: 'booksCtrl.query',
  //loadstage: 'booksCtrl.loadstage', Used to proxy over to RoR
  tagCloud: 'booksCtrl.tagCloud',
  docsWithTag: 'booksCtrl.docsWithTag',
  tagsForDoc: 'booksCtrl.tagsForDoc'
};

var loadstageCtrlStub = {
  newLoadstage: 'loadstageCtrl.newLoadstage',
  saveStage: 'loadstageCtrl.saveStage',
  moveStage: 'loadstageCtrl.moveStage'
};

var categoryCtrlStub = {
  query: 'categoryCtrl.query',
  get: 'categoryCtrl.get',
  create: 'categoryCtrl.create',
  update: 'categoryCtrl.update',
  del: 'categoryCtrl.del'
};

var documentCtrlStub = {
  query: 'documentCtrl.query',
  get: 'documentCtrl.get',
  create: 'documentCtrl.create',
  update: 'documentCtrl.update',
  del: 'documentCtrl.del'
};

var publisherCtrlStub = {
  query: 'publisherCtrl.query',
  create: 'publisherCtrl.create',
  del: 'publisherCtrl.del'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var booksIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './books.controller': booksCtrlStub,
  './loadstage.controller': loadstageCtrlStub,
  './category.controller': categoryCtrlStub,
  './document.controller': documentCtrlStub,
  './publisher.controller': publisherCtrlStub
});

describe('Books API Router:', function() {

  it('should return an express router instance', function() {
    booksIndex.should.equal(routerStub);
  });


  describe('GET /api/books', function() {

    it('should route to books.controller.query', function() {
      routerStub.get
        .withArgs('/', 'booksCtrl.query')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/books/loadstage', function() {

    it('should route to loadstage.controller.newLoadstage', function() {
      routerStub.get
        .withArgs('/loadstage', 'loadstageCtrl.newLoadstage')
        .should.have.been.calledOnce;
    });
  });
  describe('POST /api/books/savestage', function() {

    it('should route to books.controller.loadstage', function() {
      routerStub.post
        .withArgs('/savestage', 'loadstageCtrl.saveStage')
        .should.have.been.calledOnce;
    });
  });
  describe('POST /api/books/movestage', function() {

    it('should route to books.controller.loadstage', function() {
      routerStub.post
        .withArgs('/movestage', 'loadstageCtrl.moveStage')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/books/tag_cloud', function() {

  it('should route to books.controller.tagCloud', function() {
    routerStub.get
      .withArgs('/tag_cloud', 'booksCtrl.tagCloud')
      .should.have.been.calledOnce;
  });
});

describe('GET /api/books/tag', function() {

  it('should route to books.controller.docsWithTag', function() {
    routerStub.get
      .withArgs('/tag', 'booksCtrl.docsWithTag')
      .should.have.been.calledOnce;
  });
});
describe('GET /api/books/tagsForDoc', function() {

  it('should route to books.controller.tagsForDoc', function() {
    routerStub.get
      .withArgs('/tagsForDoc', 'booksCtrl.tagsForDoc')
      .should.have.been.calledOnce;
  });
});

describe('GET /api/books/categories', function() {

  it('should route to category.controller.query', function() {
    routerStub.get
      .withArgs('/categories', 'categoryCtrl.query')
      .should.have.been.calledOnce;
  });
});
describe('GET /api/books/categories/:id', function() {

  it('should route to category.controller.get', function() {
    routerStub.get
      .withArgs('/categories/:id', 'categoryCtrl.get')
      .should.have.been.calledOnce;
  });
});
describe('POST /api/books/categories', function() {

  it('should route to category.controller.create', function() {
    routerStub.post
      .withArgs('/categories', 'categoryCtrl.create')
      .should.have.been.calledOnce;
  });
});
describe('PUT /api/books/categories/:id', function() {

  it('should route to category.controller.update', function() {
    routerStub.put
      .withArgs('/categories/:id', 'categoryCtrl.update')
      .should.have.been.calledOnce;
  });
});
describe('DELETE /api/books/categories/:id', function() {

  it('should route to category.controller.del', function() {
    routerStub.delete
      .withArgs('/categories/:id', 'categoryCtrl.del')
      .should.have.been.calledOnce;
  });
});
describe('GET /api/books/documents', function() {

  it('should route to document.controller.query', function() {
    routerStub.get
      .withArgs('/documents', 'documentCtrl.query')
      .should.have.been.calledOnce;
  });
});
describe('GET /api/books/documents/:id', function() {

  it('should route to document.controller.get', function() {
    routerStub.get
      .withArgs('/documents/:id', 'documentCtrl.get')
      .should.have.been.calledOnce;
  });
});
describe('POST /api/books/documents', function() {

  it('should route to document.controller.create', function() {
    routerStub.post
      .withArgs('/documents', 'documentCtrl.create')
      .should.have.been.calledOnce;
  });
});
describe('PUT /api/books/documents/:id', function() {

  it('should route to document.controller.update', function() {
    routerStub.put
      .withArgs('/documents/:id', 'documentCtrl.update')
      .should.have.been.calledOnce;
  });
});
describe('DELETE /api/books/documents/:id', function() {

  it('should route to document.controller.del', function() {
    routerStub.delete
      .withArgs('/documents/:id', 'documentCtrl.del')
      .should.have.been.calledOnce;
  });
});

describe('GET /api/books/publishers', function() {

  it('should route to publisher.controller.query', function() {
    routerStub.get
      .withArgs('/publishers', 'publisherCtrl.query')
      .should.have.been.calledOnce;
  });
});
describe('POST /api/books/publishers', function() {

  it('should route to publisher.controller.create', function() {
    routerStub.post
      .withArgs('/publishers', 'publisherCtrl.create')
      .should.have.been.calledOnce;
  });
});
describe('DELETE /api/books/publishers/:id', function() {

  it('should route to publisher.controller.del', function() {
    routerStub.delete
      .withArgs('/publishers/:id', 'publisherCtrl.del')
      .should.have.been.calledOnce;
  });
});


});
