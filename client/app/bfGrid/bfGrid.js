'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bfGrid', {
        url: '/bfGrid',
        component: 'bfGridComponent'
      });
  });
