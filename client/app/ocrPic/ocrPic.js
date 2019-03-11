'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ocrPic', {
        url: '/ocrpic',
        component: 'ocrPicComponent'
    });

  });
