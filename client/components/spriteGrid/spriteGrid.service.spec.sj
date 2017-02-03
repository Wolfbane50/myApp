'use strict';

describe('Service: spriteGrid', function () {

  // load the service's module
  beforeEach(module('spriteGrids'));

  // instantiate service
  var spriteGrid;
  beforeEach(inject(function (_spriteGrid_) {
    spriteGrid = _spriteGrid_;
  }));

  it('should do something', function () {
    expect(!!spriteGrid).toBe(true);
  });

});
