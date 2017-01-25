'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cardCommon', {
        url: '/cards',
        component: 'cardCommonComponent'
      });
  });
