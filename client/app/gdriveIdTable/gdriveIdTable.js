angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gdriveIdTable', {
        url: '/gdriveIdTable',
        component: 'gdriveidTableComponent'
      });
  });
