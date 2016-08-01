angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carddirs', {
        url: '/carddirs',
        template: '<carddirs></carddirs>',
        css: 'app/carddirs/carddirs.css'
      });
  });
