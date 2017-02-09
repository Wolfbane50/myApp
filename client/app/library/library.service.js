'use strict';


angular.module('myappApp')
  .service('LibraryService', function() {
    var catMap = {};
    var docMap = {};
    return {
      catMapInit: function(categories) {
        angular.forEach(categories, function(cat) {
          catMap[cat.id] = cat;
        });
        console.log("Done catMapInit => " + Object.keys(catMap));
      },
      catFromId: function(id) {
        console.log("catFromId for id=" + id + "; return => " + catMap[id]);
        return catMap[id];
      },
      docMapInit: function(documents) {
        angular.forEach(documents, function(doc) {
          docMap[doc.id] = doc;
        });
      },
      // If we are walking the list of all documents anyway, it is more
      //    efficient to build the map then and set it in the service
      docMapSet: function(theMap) {
        docMap = theMap;
      },
      docFromId: function(id) {
        return docMap[id];
      }
    };
  });
