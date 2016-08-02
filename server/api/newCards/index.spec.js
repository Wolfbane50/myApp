'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newCardsCtrlStub = {
  index: 'newCardsCtrl.index',
  backup: 'newCardsCtrl.backup'
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var newCardsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './newCards.controller': newCardsCtrlStub
});

describe('newCards API Router:', function() {

  it('should return an express router instance', function() {
    newCardsIndex.should.equal(routerStub);
  });


  describe('GET /api/newCards', function() {

    it('should route to newCards.controller.newCards', function() {
      routerStub.get
        .withArgs('/', 'newCardsCtrl.index')
        .should.have.been.calledOnce;
    });

  });


});
