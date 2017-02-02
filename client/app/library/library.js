angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('library', {
        url: '/library',
        component: 'libraryComponent'
      })
      .state('library.doc', {
        component: 'libdoc',
        url: '/document/:id',
        resolve: {
//          doc: function($transition$) {
//            var myDoc = $transition$.params().doc;
//            console.log("Getting doc from doc, params => " + JSON.stringify($transition$.params()));
//            return myDoc;
//        },
          id: function($transition$) {
            console.log("Getting doc from id, params => " + JSON.stringify($transition$.params()));
            return $transition$.params().id;
          }
        }
      })
      .state('library.docdisp', {
        component: 'libdoc',
        url: '/document/view'
      });
  });
