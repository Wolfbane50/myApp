angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('drwhoTree', {
        url: '/drwhoTree',
        template: '<drwho-tree></drwho-tree>',
        css: 'app/drwhTree/drwhoTree.css'
      });
  });
