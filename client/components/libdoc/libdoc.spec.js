'use strict';

describe('libdoc Component, input structure', () => {

  let parentScope;
  let element;
  let $httpBackend;


  function findIn(el, selector) {
    return angular.element(el[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/libdoc/libdoc.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope) => {
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET('/api/books/categories')
      .respond([{
        id: 0,
        name: 'Perl'
      }, {
        id: 1,
        name: 'Miscellaneous'
      }]);

    $httpBackend.whenGET('/api/books/publishers')
      .respond([
        "O\'Reilly",
        'APress',
        'Manning',
        'McGraw Hill',
        'MS Press',
        'No Starch',
        'Packt',
        'Peachpit Press',
        'Prentice Hall',
        'Pragmatic Publishing',
        'Sams',
        '7 Summits',
        'Wrox',
        'Addison Wesley'
      ]);

    $httpBackend.whenGET(/\/api\/books\/tagsForDoc/)
      .respond([]); //no tags


    parentScope = $rootScope.$new();
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";
    parentScope.doc = {
      title: "My Title",
      id: 1
    };

    element = angular.element(`<libdoc doc="doc"></libdoc>`);
    $compile(element)(parentScope);

    parentScope.$digest();
  }));

  it('Displays initial values of Document', () => {
    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('My Title');

    // Check the Category selector
    // Check the pubisher field
    // Check the type selector
    // Check the image generated from the imageURL
  });

  it('displays changed values within  Document', () => {
    parentScope.doc.title = 'Changed Title';
    //var myTitleInp = findIn(element, '.js-title-input');
    //myTitleInp.value = 'Changed Title';
    parentScope.$digest();

    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('Changed Title');

  });

  it('displays the new document when the document pointer is changed', () => {
    parentScope.doc = {
      id : 2,
      title : "New Document"
    };
    parentScope.$digest();

    const myTitle = findIn(element, '.js-title');
    expect(myTitle.text()).toEqual('New Document');

//    const myNodocWarning = findIn(element, '.js-nodoc');
  //  expect(myNodocWarning).toBeDefined();
//    console.log("warning element display attr => " + myNodocWarning.css('color'));
//    expect(myNodocWarning.html()).toMatch(/No document selected/);

  });

  it("Will save changes to database");
  it("Will delete the document correctly");
  it('Will send google query and populate with results');
  it('Will handle google query with no results');
  it("Will revert changes from google query");

  it('Calls back when a documents category is changed');
  it ('Calls back when a document is deleted.');
  it ('Calls back when a document is saved.');

//  it('displays a notice when no document record is empty', () => {
//    parentScope.doc = {};
//    parentScope.$digest();

//    const myNodocWarning = findIn(element, '.js-nodoc');
//    console.log("warning element display attr => " + myNodocWarning.css('display'));
//    expect(myNodocWarning).not.toBeNull();
//    expect(myNodocWarning.html()).toMatch(/No document selected/);
//
//  });
});
