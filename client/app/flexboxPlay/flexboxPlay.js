angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('flexboxPlay', {
        url: '/flexbox_play',
        component: 'flexboxPlayComponent',
        css: 'app/flexboxPlay/flexboxPlay.css'
      });
  });
