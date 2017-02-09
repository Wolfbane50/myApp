// Test the category service
'use strict';

describe('Library service', () => {

  let libraryServiceObject;
  let categories;

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      libraryServiceObject = $injector.get('LibraryService');
    });
  });

 it('should return correct category for each id', () => {
   categories = [{
     id: 1, name: 'Category 1'
   }, {
     id: 2, name: 'Category 2'
   }];
   libraryServiceObject.catMapInit(categories);

    expect(libraryServiceObject.catFromId(1)).toEqual(categories[0]);
    expect(libraryServiceObject.catFromId(2)).toEqual(categories[1]);
 });
 it('should return correct document for each id, init with documents', () => {
   var documents = [{
     id: 1, title: 'Document 1'
   }, {
     id: 2, title: 'Document 2'
   }];
   libraryServiceObject.docMapInit(documents);

    expect(libraryServiceObject.docFromId(1)).toEqual(documents[0]);
    expect(libraryServiceObject.docFromId(2)).toEqual(documents[1]);
 });
 it('should return correct document for each id, init with map', () => {
   var documents = [{
     id: 1, title: 'Document 1'
   }, {
     id: 2, title: 'Document 2'
   }];
   var docMap = {
     1: documents[0],
     2: documents[1]
   };
   libraryServiceObject.docMapInit(docMap);

    expect(libraryServiceObject.docFromId(1)).toEqual(documents[0]);
    expect(libraryServiceObject.docFromId(2)).toEqual(documents[1]);
 });


});
