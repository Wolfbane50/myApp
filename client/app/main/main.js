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
    $stateProvider.state('c2tree', {
        url: '/c2tree',
       template: '<c2tree></c2tree>',
       css: 'app/c2tree/c2tree.css'
    });
  });
