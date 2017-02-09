angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('library', {
        url: '/library',
        redirectTo: 'library.default',
        component: 'libraryComponent'
      })
      .state('library.tagCloud', {
        url: '/tagCloud',
        component: 'tagCloudComponent',
        params: {
          selState: null
        },
        resolve: {
          selState: function($transition$) {
//            console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().selState;
          }
        }
      })
      .state('library.taggedDocs', {
        url: '/taggedDocs/:tag',
        component: 'taggedDocsComponent',
        params: {
          selState: null
        },
        resolve: {
          selState: function($transition$) {
        //            console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().selState;
          }
        }
      })
      .state('library.docdisp', {
        component: 'libdoc',
          params: {
            document: null
          },
//          component: 'dummyDocComponent'
          resolve: {
            doc: function($transition$) {
              console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
              return $transition$.params().document;
            }
         }
      })
      .state('library.pubdisp', {
        component: 'publisherComponent',
      })
      .state('library.catdisp', {
        component: 'categoryComponent',
      })
        .state('library.default', {
          template: '<img src="assets/images/phanatic_in_suit.jpg" >'
      });
  });

  angular.module('myappApp')
    .service('LibraryService', function() {
      var catMap = {};
      var docMap = {};
      return {
        catMapInit: function(categories) {
          angular.forEach(categories, function(cat) {
            catMap[cat.id] = cat;
          });
        },
        catFromId: function(id) {
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
