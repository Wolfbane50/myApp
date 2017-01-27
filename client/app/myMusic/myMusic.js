angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myMusic', {
        url: '/myMusic',
        component: 'myMusicComponent'
      });
  });
