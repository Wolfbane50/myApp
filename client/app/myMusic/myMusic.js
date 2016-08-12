angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myMusic', {
        url: '/myMusic',
        template: '<my-music></my-music>',
        css: 'app/myMusic/myMusic.css'
      });
  });
