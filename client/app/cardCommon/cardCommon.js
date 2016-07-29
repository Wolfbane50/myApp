angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cardCommon', {
        url: '/cards',
        template: '<cards></cards>',
        css: 'app/cardCommon/cardCommon.css'
      });
  });
