angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('spsdb', {
        url: '/spsdb',
        component: 'spsdbComponent'
      });
  });
