angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('findids', {
        url: '/findids',
        component: 'findidsComponent'
      });
  });
