'use strict';

describe('Directive: spriteGrid', function () {

  // load the directive's module
  beforeEach(module('spriteGrids'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sprite-grid></sprite-grid>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the spriteGrid directive');
  }));
});
