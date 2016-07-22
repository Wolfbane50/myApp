'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bftree', {
        url: '/bftree',
        template: '<bftree></bftree>'
      });
  });
