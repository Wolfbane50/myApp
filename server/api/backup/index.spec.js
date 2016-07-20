'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var backupCtrlStub = {
  index: 'backupCtrl.index',
  show: 'backupCtrl.show',
  create: 'backupCtrl.create',
  update: 'backupCtrl.update',
  destroy: 'backupCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
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

  describe('GET /api/backups', function() {

    it('should route to backup.controller.index', function() {
      routerStub.get
        .withArgs('/', 'backupCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/backups/:id', function() {

    it('should route to backup.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'backupCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/backups', function() {

    it('should route to backup.controller.create', function() {
      routerStub.post
        .withArgs('/', 'backupCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/backups/:id', function() {

    it('should route to backup.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'backupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/backups/:id', function() {

    it('should route to backup.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'backupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/backups/:id', function() {

    it('should route to backup.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'backupCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
