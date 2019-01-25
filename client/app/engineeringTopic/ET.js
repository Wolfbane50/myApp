'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ET', {
        url: '/ET',
        component: 'eTComponent'
      });
  });
