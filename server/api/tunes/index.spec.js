'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tunesCtrlStub = {
  index: 'tunesCtrl.index',
  albumSearch: 'tunesCtrl.albumSearch'
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var tunesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './tunes.controller': tunesCtrlStub
});

describe('tunes API Router:', function() {

  it('should return an express router instance', function() {
    tunesIndex.should.equal(routerStub);
  });


  describe('GET /api/tunes', function() {

    it('should route to tunes.controller.index', function() {
      routerStub.get
        .withArgs('/', 'tunesCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/tunes/search', function() {

    it('should route to tunes.controller.albumSearch', function() {
      routerStub.get
        .withArgs('/search', 'tunesCtrl.albumSearch')
        .should.have.been.calledOnce;
    });

  });


});
