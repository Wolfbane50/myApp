'use strict';

describe('StarredDoc Component', () => {
  let parentScope;
  let element;
  let $httpBackend;
  let processedDocument;

  function findIn(el, selector) {
    return angular.element(el[0].querySelector(selector));
  }


  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/libdoc/libdoc.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope, $window, LibraryService) => {
    $httpBackend = _$httpBackend_;

    myCategories = [{
      id: 0,
      name: 'Perl'
    }, {
      id: 1,
      name: 'Miscellaneous'
    }];

    // Need to initialize LibraryService catMap (would normally be done by top-level component)
    myLibService.catMapInit(myCategories);

    $httpBackend.whenGET('/api/books/categories')
      .respond(myCategories);

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
      category_id: 1,
      //      author: "No Author",
      //      publisher: "Best Publishers",
      //      image_url: "None",
      //      description: "No Description",
      //      copywrite: 1900,
      id: 1
    };
    spyOn(parentScope, "saveCallback").and.callThrough();
    spyOn(parentScope, "deleteCallback").and.callThrough();
    spyOn(parentScope, "catChangeCallback").and.callThrough();


    element = angular.element(`<starred-doc starred="true" doc="doc" on-save="saveCallback(document)" on-delete="deleteCallback(document)" on-category-change="catChangeCallback(old, chg, document)" ></libdoc>`);
    $compile(element)(parentScope);

    parentScope.$digest();

  }));

  it('should initialize to initial value of starred', () => {
    const theStar = findIn(element, '.js-star-icon');
    expect(theStar.prop('class')).to.contain('glyphicon glyphicon-star');
  });
  it('should initialize to initial value of not starred');
  it('should toggle values correctly');
  it('should initialize and display document correctly');


});
