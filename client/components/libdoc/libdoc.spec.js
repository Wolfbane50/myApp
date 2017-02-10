'use strict';

describe('libdoc Component, input structure', () => {

  let parentScope;
  let element;
  let $httpBackend;
  let processedDocument;
  let oldId;
  let newId;
  let $win;
  let myLibService;
  let myCategories;


  function findIn(el, selector) {
    return angular.element(el[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/libdoc/libdoc.html'));

  beforeEach(inject((_$httpBackend_, $http, $compile, $rootScope, $window, LibraryService) => {
    $httpBackend = _$httpBackend_;
    $win = $window;
    myLibService = LibraryService;

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

    parentScope.saveCallback = function(document) {
      // Verify doc
      console.log("In parentScope.saveCallback, doc => " + JSON.stringify(document));
      processedDocument = document;
    };
    parentScope.deleteCallback = function(document) {
      // Verify doc
      console.log("In parentScope.deleteCallback, doc => " + JSON.stringify(document));
      processedDocument = document;
    };
    parentScope.catChangeCallback = function(old, chg, document) {
      // Verify doc
      console.log("In parentScope.catChangeCallback, doc => " + JSON.stringify(document));
      processedDocument = document;
      oldId = old;
      newId = chg;
    };

    spyOn(parentScope, "saveCallback").and.callThrough();
    spyOn(parentScope, "deleteCallback").and.callThrough();
    spyOn(parentScope, "catChangeCallback").and.callThrough();


    element = angular.element(`<libdoc doc="doc" on-save="saveCallback(document)" on-delete="deleteCallback(document)" on-category-change="catChangeCallback(old, chg, document)" ></libdoc>`);
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
      id: 2,
      title: "New Document"
    };
    parentScope.$digest();

    const myTitle = findIn(element, '.js-title');
    expect(myTitle.text()).toEqual('New Document');

  });

  // Button IDs: js-google-btn, js-revert-btn, js-save-btn, js-delete-btn


  it("Will save changes to database", () => {

    const saveButton = findIn(element, '#js-save-btn');
    parentScope.doc.publisher = "Supreme Publishing";
    parentScope.$digest();
    $httpBackend.expectPUT('/api/books/documents/1', {
        document: {
          title: "My Title",
          category_id: 1,
          id: 1,
          publisher: "Supreme Publishing"
        }
      })
      .respond();

    saveButton.click();
    $httpBackend.flush();

    expect(parentScope.saveCallback).toHaveBeenCalled();
    expect(processedDocument).toBeDefined();
    expect(processedDocument.publisher).toEqual('Supreme Publishing');


  });
  it("Will delete the document correctly", () => {
    spyOn($win, 'confirm').and.callFake(function() {
      return true;
    });
    const deleteButton = findIn(element, '#js-delete-btn');
    $httpBackend.expectDELETE('/api/books/documents/1')
      .respond();

    deleteButton.click();
    $httpBackend.flush();

    expect(parentScope.deleteCallback).toHaveBeenCalled();
    expect(processedDocument).toBeDefined();
    expect(processedDocument.title).toEqual('My Title');

  });
  it('Will send google query and populate with results', () => {
    //    $httpBackend.expectGET("/api/books?author=No+Author&publisher=Best+Publishers&title=My+Title")
    $httpBackend.expectGET("/api/books?title=My+Title")
      .respond({
        title: "Updated Title",
        author: "I.M. Author",
        publisher: "Supreme",
        copywrite: 2007,
        description: "test description",
        image_url: "http://localhost:3000/assets/document.gif"
      });
    const googleButton = findIn(element, '#js-google-btn');
    googleButton.click();

    $httpBackend.flush();
    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('Updated Title');
    const myAuthor = findIn(element, '#author_inp').val();
    expect(myAuthor).toEqual('I.M. Author');
    const myPublisher = findIn(element, '#js-publisher').val();
    expect(myPublisher).toEqual('Supreme');
    const myCopyright = findIn(element, '#cc_inp').val();
    expect(myCopyright).toEqual('2007');
    const myDescription = findIn(element, '#descriptionText').val();
    expect(myDescription).toEqual('test description');
    const myImageUrl = findIn(element, '#img_inp').val();
    expect(myImageUrl).toEqual('http://localhost:3000/assets/document.gif');
    //    const myImage = findIn(element, '.js-bk-image').attr('src');
    //  expect(myImage).toEqual('http://localhost:3000/assets/document.gif');

  });
  it('Will handle google query with no results');
  it("Will revert changes from google query", () => {
    $httpBackend.expectGET("/api/books?title=My+Title")
      .respond({
        title: "Updated Title",
        author: "I.M. Author",
        publisher: "Supreme",
        copywrite: 2007,
        description: "test description",
        image_url: "http://localhost:3000/assets/document.gif"
      });
    const googleButton = findIn(element, '#js-google-btn');
    googleButton.click();

    $httpBackend.flush();

    const myTitle = findIn(element, '.js-title');
    expect(myTitle.text()).toEqual('Updated Title');
    const myAuthor = findIn(element, '#author_inp');
    expect(myAuthor.val()).toEqual('I.M. Author');

    const revertButton = findIn(element, '#js-revert-btn');
    revertButton.click();
    expect(myTitle.text()).toEqual('My Title');
    expect(myAuthor.val()).toEqual('');


  });

  it('Calls back when a documents category is changed', () => {
      // Flush to send categories response
      $httpBackend.flush();

      const catSelect = findIn(element, '#CatPick');
      expect(catSelect.prop('length')).toEqual(2);
      expect(catSelect.prop('selectedIndex')).toEqual(1);

//    Not really changing value, just triggering the callback
      catSelect.change();  // Should trigger the onChanges

      expect(parentScope.catChangeCallback).toHaveBeenCalled();
      expect(processedDocument.category_id).toEqual(1);
      expect(oldId).toBeDefined();
      expect(oldId).toEqual(1);
      expect(newId).toBeDefined();
      expect(newId).toEqual(1);


  });

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
