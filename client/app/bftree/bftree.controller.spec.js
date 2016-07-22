'use strict';

describe('Component: BftreeComponent', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var BftreeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    BftreeComponent = $componentController('bftree', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
