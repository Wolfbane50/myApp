'use strict';

describe('libdoc Component, input structure', () => {

  let parentScope;
  let element;
  let $httpBackend;

  function findIn(element, selector) {
    return angular.element(element[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('app/library/libdoc.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope) => {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/books/categories')
      .respond([{
        id: 0,
        name: 'Perl'
      }, {
        id: 1,
        name: 'Miscellaneous'
      }]);
    $httpBackend.expectGET('/api/books/publishers')
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
    $httpBackend.expectGET(/\/api\/books\/tagsForDoc/)
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
  });

  it('displays changed values of Dcoument', () => {
    parentScope.doc.title = 'Changed Title';
    var myTitleInp = findIn(element, '.js-title-input');
    myTitleInp.value = 'Changed Title';
    parentScope.$digest();

    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('Changed Title');

  });
});
describe('libdoc Component, input id', () => {
  var queryId;
  let parentScope;
  let element;
  let $httpBackend;

  function findIn(element, selector) {
    return angular.element(element[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('app/library/libdoc.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope) => {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/books/categories')
      .respond([{
        id: 0,
        name: 'Perl'
      }, {
        id: 1,
        name: 'Miscellaneous'
      }]);
    $httpBackend.expectGET('/api/books/publishers')
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

    $httpBackend.expectGET(/\/api\/books\/documents\/(.+)/, undefined, undefined, ['id'])
      .respond(function(method, url, data, params) {
        queryId = params.id;
        console.log("Document request for ID = " + params.id);
        return [200, {
          title: "My Title",
          id: 1
        }];
      });

    $httpBackend.whenGET(/\/api\/books\/tagsForDoc/)
      .respond([]); //no tags



    parentScope = $rootScope.$new();
    parentScope.id = 482;
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";

    element = angular.element(`<libdoc id="id"></libdoc>`);
    $compile(element)(parentScope);

    parentScope.$digest();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('Requests the correct document from database', () => {
    expect(queryId).toEqual(482);
  });
  it('Displays initial values of Document', () => {
    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('My Title');
  });

  it('displays changed values of Document', () => {
    var myTitleInp = findIn(element, '.js-title-input');
    myTitleInp.value = 'Changed Title';

    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('Changed Title');

  });
});
