'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('guiCatalog', {
        url: '/guiCatalog',
        component: 'guiCatalogComponent'
      });
  });
