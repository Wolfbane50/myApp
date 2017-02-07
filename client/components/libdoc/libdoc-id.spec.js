describe('libdoc Component, input id', () => {
  let queryId;
  let parentScope;
  let element;
  let $httpBackend;

  function findIn(element, selector) {
    return angular.element(element[0].querySelector(selector));
  }



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(module('components/libdoc/libdoc.html'));


  afterEach(function() {
//    $httpBackend.verifyNoOutstandingExpectation();
//    $httpBackend.verifyNoOutstandingRequest();
  });


  it('Requests the correct document from database',
           inject((_$httpBackend_, $http, $compile, $rootScope) => {

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
      .respond(
       [
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

    $httpBackend.whenGET(/\/api\/books\/documents\//)
       .respond({
                title: "My Title",
                id: 482
    });

    $httpBackend.whenGET(/\/api\/books\/tagsForDoc/)
      .respond([]); //no tags



    parentScope = $rootScope.$new();
    parentScope.id = 482;
    // Set attributes on the parentScoope e.g. parentScope.attr ="blah";

    element = angular.element(`<libdoc id="id"></libdoc>`);
    $compile(element)(parentScope);

    parentScope.$digest();

//    $httpBackend.whenGET(/\/api\/books\/documents\/(.+)/, undefined, undefined, ['id'])
//      .respond(function(method, url, data, params) {
//        queryId = params.id;
//        console.log("Document request for ID = " + params.id);
//        return [200, {
//          title: "My Title",
//          id: 1
//        }];
//      });
//      $httpBackend.flush();


    $httpBackend.flush();

    const myIdString = findIn(element, '.js-id').text();
    expect(myIdString).toEqual("ID:  482");

    const myTitle = findIn(element, '.js-title').text();
    expect(myTitle).toEqual('My Title');


  }));
// Need test of changing ID and load new document

});
