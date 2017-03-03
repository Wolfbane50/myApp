'use strict';

// Not currently using
angular.module('myappApp', ['myappApp.auth', 'myappApp.admin', 'myappApp.constants', 'ngCookies', 'ngAnimate',
     'ngResource', 'ui.select', 'ngSanitize', 'btford.socket-io', 'ui.router', 'angularCSS', 'ui.bootstrap', 'ui.tree',
    'validation.match', 'spriteGrids', 'bootstrapLightbox', 'myappApp.googleBooks', 'ngToast', 'nk.touchspin',
     'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay', 'com.2fdevs.videogular.plugins.poster'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
