'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('drwhoTree', {
        url: '/drwhoTree',
        component: 'drwhoTreeComponent'
      });
  });
