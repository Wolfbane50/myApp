angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('noncompliance', {
        url: '/noncompliance',
        component: 'noncomplianceComponent'
      });
  });
