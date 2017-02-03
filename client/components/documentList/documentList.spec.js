'use strict';

describe('documentList Component', () => {

  let parentScope;
  let element;
  let selectedDocument;

  function findIn(element, selector) {
    return angular.element(element[0].querySelector(selector));
  }

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/documentList/documentList.html'));

  beforeEach(inject(($compile, $rootScope) => {
    parentScope = $rootScope.$new();
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";
    parentScope.list = [{
      title: "My Title",
      id: 1
    } , {
      title: "My Second Title",
      id: 2
    }];

    parentScope.selectCallback = function(document) {
      // Verify doc
      console.log("In parentScope.selectCallback, doc => " + JSON.stringify(document));
      selectedDocument = document;
    };

    spyOn(parentScope, "selectCallback").and.callThrough();
    // parentScope.callbackSpy = jasmine.createSpy("selectCallbackSpy");

    element = angular.element(`<document-list docs="list" on-select="selectCallback(document)"></document-list>`);
    $compile(element)(parentScope);

    parentScope.$digest();

  }));

  it('Displays initial values of list', () => {

    // Find the first title
    const myTitle = findIn(element, '.js-document-title').text();
    expect(myTitle).toEqual('My Title');

    // Check we rendered two documents
  });

  it('Calls back on document selection', () => {
    // Find the first title
    const myLink = findIn(element, '.js-document-title');
    if(! myLink) {
      console.log('Anchor element not found!');
    }
    myLink.click();
    //myLink.trigger('click');
    //myLink.triggerHandle('click');

    expect(parentScope.selectCallback).toHaveBeenCalled();
    expect(selectedDocument).toBeDefined();
    expect(selectedDocument.title).toEqual('My Title');

  });
});
