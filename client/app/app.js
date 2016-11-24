'use strict';

// Not currently using
angular.module('myappApp', ['myappApp.auth', 'myappApp.admin', 'myappApp.constants', 'ngCookies', 'ngAnimate',
     'ngResource', 'ui.select', 'ngSanitize', 'btford.socket-io', 'ui.router', 'angularCSS', 'ui.bootstrap', 'ui.tree',
    'validation.match', 'spriteGrids', 'bootstrapLightbox', 'myappApp.googleBooks', 'ngToast'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
