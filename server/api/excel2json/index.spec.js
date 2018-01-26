'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var excel2jsonCtrlStub = {
  convert: 'excel2jsonCtrl.convert'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var excel2jsonIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './excel2json.controller': excel2jsonCtrlStub
});

describe('excel2json API Router:', function() {

  it('should return an express router instance', function() {
    excel2jsonIndex.should.equal(routerStub);
  });


  describe('GET /api/excel2json', function() {

    it('should route to excel2json.controller.convert', function() {
      routerStub.get
        .withArgs('/', 'excel2jsonCtrl.convert')
        .should.have.been.calledOnce;
    });

  });



});
