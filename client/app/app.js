'use strict';

angular.module('myappApp', ['myappApp.auth', 'myappApp.admin', 'myappApp.constants', 'ngCookies',
    'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'ui.tree',
    'validation.match', 'spriteGrids'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
