'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('spriteGridExample', {
        url: '/spriteGridExample',
        template: '<sprite-grid-example></sprite-grid-example>'
      });
  });
