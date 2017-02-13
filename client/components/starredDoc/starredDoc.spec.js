'use strict';

describe('StarredDoc Component', () => {
  let parentScope;
  let element;
  let $httpBackend;
  let processedStar;
  let processedDocument;
  let myCategories;

  function findIn(el, selector) {
    return angular.element(el[0].querySelector(selector));
  }


  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/starredDoc/starredDoc.html'));
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
    parentScope = $rootScope.$new();
    parentScope.toggleCallback = function(document, toValue) {
      // Verify doc
      console.log("In parentScope.toggleCallback,  toggling doc with id (" + document.id + " to " + toValue);
      processedStar = toValue;
    };
    spyOn(parentScope, "toggleCallback").and.callThrough();
    parentScope.saveCallback = function(document) {
      // Verify doc
      console.log("In parentScope.saveCallback, doc => " + JSON.stringify(document));
      processedDocument = document;
    };
    spyOn(parentScope, "saveCallback").and.callThrough();


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

    element = angular.element(`<starred-doc starred="'true'" doc="doc" on-star-toggle="toggleCallback(document, toValue)" on-save="saveCallback(document)" ></starred-doc>`);
    $compile(element)(parentScope);

    parentScope.$digest();

  }));

  it('should initialize to initial value of starred', () => {
    const theStar = findIn(element, '#js-star-icon');
    const theStarAnchor = findIn(element, '#js-star-anchor');
    console.log("HTML of theStar => " + theStarAnchor.html());
    expect(theStar.hasClass('glyphicon-star')).toBe(true);
    expect(theStar.hasClass('glyphicon-star-empty')).toBe(false);
  });
  it('should initialize to initial value of not starred');
  it('should toggle values correctly', () => {
    const theStar = findIn(element, '#js-star-icon');
    const theStarAnchor = findIn(element, '#js-star-anchor');
    console.log("HTML of theStar => " + theStarAnchor.html());
    //expect(theStar.hasClass('glyphicon-star')).toBe(true);
    //expect(theStar.hasClass('glyphicon-star-empty')).toBe(false);
    theStarAnchor.click();
    console.log("HTML of theStar => " + theStarAnchor.html());
    expect(theStar.hasClass('glyphicon-star')).toBe(false);
    expect(theStar.hasClass('glyphicon-star-empty')).toBe(true);

  });
  it('should callback on toggle', () => {
    const theStarAnchor = findIn(element, '#js-star-anchor');
    theStarAnchor.click();
    $httpBackend.flush();

    expect(parentScope.toggleCallback).toHaveBeenCalled();
    expect(processedStar).toBeDefined();
    expect(processedStar).toBe(false);

  });
  it('should initialize and display document correctly', () => {
    //console.log("Rendered html => " + element.html());
    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('My Title');
  });

  it('should callback on document save', () => {
    const saveButton = findIn(element, '#js-save-btn');
    $httpBackend.expectPUT('/api/books/documents/1', {
        document: {
          title: "My Title",
          category_id: 1,
          id: 1        }
      })
      .respond();

    saveButton.click();
    $httpBackend.flush();

    expect(parentScope.saveCallback).toHaveBeenCalled();
    expect(processedDocument).toBeDefined();
    expect(processedDocument.title).toEqual('My Title');

  });
  // Should test the delete and category change callbacks as well

});
