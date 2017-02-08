// Test the category service
'use strict';

describe('Category service', () => {

  let $httpBackend;
  let mockCategoryResource;

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      mockCategoryResource = $injector.get('Category');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Can query DB for all categories', inject(function(Category) {
    var theCategories = [{
        id: 0,
        name: 'Perl'
      }, {
        id: 1,
        name: 'Miscellaneous'
      }];

    $httpBackend.expectGET('/api/books/categories')
      .respond(theCategories);

      var myCategories = mockCategoryResource.query();

      $httpBackend.flush();

      expect(myCategories.length).toEqual(2);
      expect(myCategories[0].name).toEqual('Perl');
      expect(myCategories[1].id).toEqual(1);


  }));


  it('Can create a new category', () => {
    var catName = "My New Category";

    $httpBackend.expectPOST('/api/books/categories', { name: "My New Category"})
      .respond();

    // Note: real API returns the new category ID in the response.
    //    As of now the category component doesn't use it, hence no test

      mockCategoryResource.create({
          name: catName
        });
        $httpBackend.flush();
  });
  it('Can update a category', () => {
    var catName = "Updated Category";

    $httpBackend.expectPUT('/api/books/categories', { name: "Updated Category", id: 15 })
      .respond();

      mockCategoryResource.update({
          name: catName,
          id: 15
        });
        $httpBackend.flush();

  });
  it('Can delete a category', () => {
    $httpBackend.expectDELETE('/api/books/categories/24')
      .respond();

      mockCategoryResource.delete({
          id: 24
        });
        $httpBackend.flush();

  });
  it('Will cache multiple queries', () => {
    var theCategories = [{
        id: 0,
        name: 'Perl'
      }, {
        id: 1,
        name: 'Miscellaneous'
      }];

    // Expect only on get request
    $httpBackend.expectGET('/api/books/categories')
      .respond(theCategories);

      var myCategories = mockCategoryResource.query();
      $httpBackend.flush();
      var myOtherCategories = mockCategoryResource.query();


  });


});
