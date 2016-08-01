angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dirExplorer', {
        url: '/dir-explorer',
        template: '<dir-explorer></dir-explorer>',
        css: 'app/dirExplorer/dirExplorer.css'
      });
  });
