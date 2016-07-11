'use strict';

angular.module('myappApp.auth', ['myappApp.constants', 'myappApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
