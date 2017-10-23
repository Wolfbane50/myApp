'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myEpub', {
        url: '/myEpub',
        component: 'myEpubComponent',
        css: 'app/myEpub/main.css'
      });
  });
