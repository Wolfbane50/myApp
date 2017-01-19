'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('c2tree', {
        url: '/c2tree',
        component: 'c2treeComponent',
        css: 'app/c2tree/c2tree.css'
      });
  });
