'use strict';

describe('Component: SpriteGridExampleComponent', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var SpriteGridExampleComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    SpriteGridExampleComponent = $componentController('spriteGridExample', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
