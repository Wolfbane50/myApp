'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var booksCtrlStub = {
  query: 'booksCtrl.query'
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var booksIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './books.controller': booksCtrlStub
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


});
