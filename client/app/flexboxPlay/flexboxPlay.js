angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('flexboxPlay', {
        url: '/flexbox_play',
        template: '<flexboxplay></flexboxplay>',
        css: 'app/flexboxPlay/flexboxPlay.css'
      });
  });
