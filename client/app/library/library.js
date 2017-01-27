angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('library', {
        url: '/library',
        component: 'libraryComponent'
      })
      .state('library.doc', {
        url: '/document/:id',
        component: 'libdoc',
        resolve: {
          id: function($transition$) {
            return $transition$.params().id;
          }
        }
      });
  });
