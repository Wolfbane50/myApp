'use strict';

// Not currently using
angular.module('myappApp', ['myappApp.auth', 'myappApp.admin', 'myappApp.constants', 'ngCookies',
     'ngResource', 'ui.select', 'ngSanitize', 'btford.socket-io', 'ui.router', 'angularCSS', 'ui.bootstrap', 'ui.tree',
    'validation.match', 'spriteGrids', 'bootstrapLightbox'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
