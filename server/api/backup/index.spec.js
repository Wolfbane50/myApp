'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var backupCtrlStub = {
  index: 'backupCtrl.index',
  backup: 'backupCtrl.backup'
};

var routerStub = {
  post: sinon.spy(),
};

// require the index with our stubbed out modules
var backupIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './backup.controller': backupCtrlStub
});

describe('Backup API Router:', function() {

  it('should return an express router instance', function() {
    backupIndex.should.equal(routerStub);
  });


  describe('POST /api/backups', function() {

    it('should route to backup.controller.backup', function() {
      routerStub.post
        .withArgs('/', 'backupCtrl.backup')
        .should.have.been.calledOnce;
    });

  });


});
