'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var idsCtrlStub = {
  idsSearch: 'finder.idsSearch'  //?????
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var idsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './finder.controller': idsCtrlStub
});

describe('ids API Router:', function() {

  it('should return an express router instance', function() {
    idsIndex.should.equal(routerStub);
  });


  describe('GET /api/ids', function() {

    it('should route to finder.controller.idsSearch', function() {
      routerStub.get
        .withArgs('/', 'finder.idsSearch')
        .should.have.been.calledOnce;
    });

  });



});
