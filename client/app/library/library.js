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
        component: 'taggedDocsComponent'
      })
      .state('library.docdisp', {
        component: 'libdoc',
          params: {
            document: null,
          },
//          component: 'dummyDocComponent'
//          resolve: {
//            doc: function($transition$) {
//              console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
//              return $transition$.params().document;
//            }

//          }
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
