'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('spriteGridExample', {
        url: '/spriteGridExample',
        component: 'spriteGridExampleComponent'
      });
  });
