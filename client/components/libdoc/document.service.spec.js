// Test the category service
'use strict';

describe('Document service', () => {

  let $httpBackend;
  let mockDocumentResource;

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      mockDocumentResource = $injector.get('Document');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Can query DB for all doucments', () => {
    var theDocuments = [{
        title: "My Title",
        id: 1
      } , {
        title: "My Second Title",
        id: 2
      }];

    $httpBackend.expectGET('/api/books/documents')
      .respond(theDocuments);

      var myDocuments = mockDocumentResource.query();

      $httpBackend.flush();

      expect(myDocuments.length).toEqual(2);
      expect(myDocuments[0].title).toEqual('My Title');
      expect(myDocuments[1].id).toEqual(2);


  });

it('Can get a single document', () => {
   var myDocId = 62;
   var theDocument = {
     title: "My Special Document",
     id: 62
   };
   $httpBackend.expectGET('/api/books/documents/62')
     .respond(theDocument);

     var myDoc = mockDocumentResource.get({ id: myDocId });

     $httpBackend.flush();

     expect(myDoc.title).toEqual('My Special Document');
     expect(myDoc.id).toEqual(myDocId);


 });


 it('Can create a new document', () => {
   var myDoc = {
     title: "My New Document",
     category_id: 4
    };

   $httpBackend.expectPOST('/api/books/documents', { document:  { title: "My New Document", category_id : 4 }})
     .respond({
       id: 4,
       title: "My New Document",
       category_id: 4
     });

     var myNewDoc = mockDocumentResource.create({
         document: myDoc
       });


       $httpBackend.flush();
       var props = Object.keys(myNewDoc);

       //("id", "title", "category_id")
       expect(props).toContain("id");
       expect(props).toContain("title");
       expect(props).toContain("category_id");
 });

 it('Can update a document', () => {
   var catName = "Updated Document";

   $httpBackend.expectPUT('/api/books/documents/15', { title: "Updated Document", id: 15 })
     .respond();

     mockDocumentResource.update({
         title: catName,
         id: 15
       });
       $httpBackend.flush();

 });
 it('Can delete a document', () => {
   $httpBackend.expectDELETE('/api/books/documents/24')
     .respond();

     mockDocumentResource.delete({
         id: 24
       });
       $httpBackend.flush();

 });

});
