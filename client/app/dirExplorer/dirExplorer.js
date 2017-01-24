angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dirExplorer', {
        url: '/dir-explorer',
        component: 'dirExplorerComponent'
      });
  });
