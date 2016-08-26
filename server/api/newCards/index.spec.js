'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newCardsCtrlStub = {
  index: 'newCardsCtrl.index',
  update: 'newCardsCtrl.update'
};

var buntCtrlStub ={
  index: 'buntCtrl.index',
  update: 'buntCtrl.update',
  getIds: 'buntCtrl.getIds'
};

var chachiCtrlStub = {
  index: 'chachiCtrl.index',
  update: 'chachiCtrl.update'
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var newCardsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './newCards.controller': newCardsCtrlStub,
  './chachi.controller' : chachiCtrlStub,
  './buntCards.controller' : buntCtrlStub
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

  describe('POST /api/newCards', function() {

    it('should route to newCards.controller.newCards', function() {
      routerStub.post
        .withArgs('/', 'newCardsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/newCards/bunt', function() {

    it('should route to buntCards.controller.index', function() {
      routerStub.get
        .withArgs('/bunt', 'buntCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/newCards/drive', function() {

    it('should route to buntCards.controller.getIds', function() {
      routerStub.get
        .withArgs('/drive', 'buntCtrl.getIds')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/newCards/bunt', function() {

    it('should route to buntCards.controller.update', function() {
      routerStub.post
        .withArgs('/bunt', 'buntCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/newCards/chachi', function() {

    it('should route to chachi.controller.update', function() {
      routerStub.post
        .withArgs('/chachi', 'chachiCtrl.update')
        .should.have.been.calledOnce;
    });

  });
  describe('GET /api/newCards/chachi', function() {

    it('should route to chachi.controller.index', function() {
      routerStub.get
        .withArgs('/chachi', 'chachiCtrl.index')
        .should.have.been.calledOnce;
    });

  });



});
