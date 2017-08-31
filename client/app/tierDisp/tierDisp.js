angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tierDisp', {
        url: '/tierDisp',
        component: 'tierDispComponent'
      });
  });
