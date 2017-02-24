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
        component: 'tagCloudComponent'
      })
      .state('library.taggedDocs', {
        url: '/taggedDocs/:tag',
        component: 'taggedDocsComponent',
        params: {
          selState: 'library.docdisp'
        },
        resolve: {
          selState: function($transition$) {
        //            console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
         //      return $transition$.params().selState;
            return "library.docdisp";
          }
        }
      })
      .state('library.docdisp', {
        component: 'libdoc',
//          component: 'starredDoc',
          params: {
            document: null
          },
//          component: 'dummyDocComponent'
          resolve: {
            doc: function($transition$) {
              //console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
              return $transition$.params().document;
//            },
//            starred: function($transition$) {
//               var id = $transition$.params().document.id;
//                 if ($ctrl.config.starredHash[id]) {
//                   console.log("Doc is starred!!");
//                   return true;
//                 } else {
//                   console.log("Doc is not starred!");
//                   return false;
//                 }
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
