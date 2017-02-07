'use strict';

describe('tagCloud Component', () => {

  let parentScope;
  let element;
  let $httpBackend;


  function findIn(el, selector) {
    return angular.element(el[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('app/library/tagCloud.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope) => {
    $httpBackend = _$httpBackend_;
    // Got tagCloud => [{"count":1,"id":104,"name":"access"},{"count":1,"id":76,"name":"ace"}]
    $httpBackend.expectGET('/api/books/tag_cloud')
      .respond([{
        id: 0,
        name: 'Tag1',
        count: 3
      }, {
        id: 1,
        name: 'Tag2',
        count: 5
      }]);

    parentScope = $rootScope.$new();
    parentScope.selCallback = function(document) {
      // Verify doc
      console.log("In parentScope.selCallback, doc => " + JSON.stringify(document));
      selectedDocument = document;
    };
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";

    element = angular.element(`<tag-cloud-component on-select="selCallback"></tag-cloud-component>`);
    $compile(element)(parentScope);

    parentScope.$digest();
  })); // end beforeEach

  it('Fill out tag cloud correctly', () => {
    const myTag = findIn(element, '.js-tag-anchor');
    if (angular.isElement(myTag)) {
      console.log("found element: " + myTag.classList);
    } else {
      console.log(".js-tag-anchor not found!");
    }
    expect(myTag.text()).toEqual('Tag1');

  });


}); //end describe
