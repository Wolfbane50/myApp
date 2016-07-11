'use strict';

angular.module('myappApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>'
    });
    $stateProvider.state('spGridExample', {
      url: '/spriteGridExample',
      template: '<sprite-grid-example></sprite-grid-example>'
    });
  });
