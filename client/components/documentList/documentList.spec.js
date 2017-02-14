'use strict';

describe('documentList Component', () => {

  let parentScope;
  let element;
  let removedDocument;
  let $win;

  function findIn(element, selector) {
    return angular.element(element[0].querySelector(selector));
  }

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/documentList/documentList.html'));

  beforeEach(inject(($compile, $rootScope, $window) => {
    $win = $window;
    parentScope = $rootScope.$new();
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";
    parentScope.list = [{
      title: "My Title",
      id: 1
    } , {
      title: "My Second Title",
      id: 2
    }];

    parentScope.removeCB = function(document) {
      removedDocument = document;
    }

    parentScope.listOptions = {
      showDelete: true
    };


    spyOn(parentScope, "removeCB").and.callThrough();
    // parentScope.callbackSpy = jasmine.createSpy("selectCallbackSpy");

    element = angular.element(`<document-list docs="list" options="listOptions" on-remove="removeCB(document)"></document-list>`);
    $compile(element)(parentScope);

    parentScope.$digest();

  }));

  it('Displays initial values of list', () => {

    // Find the first title
    const myTitle = findIn(element, '.js-document-title').text();
    expect(myTitle).toEqual('My Title');

    // Check we rendered two documents
  });

  //it('Does not display delete buttons if not in options', () => {
//    const myDelButton = findIn(element, '.js-remove-btn');
//    expect(myDelButton.hasClass('ng-hide')).toBe(true);
//  });

  it('Will support removal of documents if specified in options.', () => {
    spyOn($win, 'confirm').and.callFake(function() {
      return true;
    });

    //parentScope.listOptions.showDelete = true;
  //  parentScope.$digest();
    const myDelButton = findIn(element, '.js-remove-btn');
    expect(myDelButton.hasClass('ng-hide')).toBe(false);
    myDelButton.click();
    expect(parentScope.removeCB).toHaveBeenCalled();
    expect(removedDocument).toBeDefined();
    expect(removedDocument).toEqual(parentScope.list[0]);
  })

//  it('Calls back on document selection', () => {
//    // Find the first title
//    const myLink = findIn(element, '.js-document-title');
//    if(! myLink) {
//      console.log('Anchor element not found!');
//    }
//    myLink.click();

//    expect(parentScope.selectCallback).toHaveBeenCalled();
//    expect(selectedDocument).toBeDefined();
//    expect(selectedDocument.title).toEqual('My Title');
//  });

//  it('Sets state on document selection', () => {
//  });


});
