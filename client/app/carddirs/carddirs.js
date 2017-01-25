angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carddirs', {
        url: '/carddirs',
        component: 'carddirsComponent'
      });
  });
