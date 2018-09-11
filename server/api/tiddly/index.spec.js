'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tiddlyCtrlStub = {
  update: 'tiddlyCtrl.update',
};


var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var tiddlyIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './tiddly.controller': tiddlyCtrlStub
});

describe('Tiddly API Router:', function() {

  it('should return an express router instance', function() {
    tiddlyIndex.should.equal(routerStub);
  });


  describe('PUT /api/tiddly', function() {

    it('should route to tiddly.controller.update', function() {
      routerStub.put
        .withArgs('/', 'tiddlyCtrl.update')
        .should.have.been.calledOnce;
    });
  });


});
