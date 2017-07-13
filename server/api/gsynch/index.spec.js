'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var gsynchCtrlStub = {
  index:   'gsynchCtrl.index',
   update: 'gsynchCtrl.update'
};

var routerStub = {
  post: sinon.spy()
};

// require the index with our stubbed out modules
var gsynchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      console.log("====== In router");
      return routerStub;
    }
  },
  './gsynch.controller': gsynchCtrlStub
});

describe('gsynch API Router:', function() {

  it('should return an express router instance', function() {
    gsynchIndex.should.equal(routerStub);
  });


  describe('POST /api/gysnch', function() {

    it('should route to synch.controller.update', function() {
      routerStub.post
        .withArgs('/', 'gsynchCtrl.update')
        .should.have.been.calledOnce;
    });

  });


});
