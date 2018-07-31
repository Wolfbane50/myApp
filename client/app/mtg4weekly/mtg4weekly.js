'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mtg4weekly', {
        url: '/mtg4weekly',
        component: 'mtg4weeklyComponent'
      });
  });
