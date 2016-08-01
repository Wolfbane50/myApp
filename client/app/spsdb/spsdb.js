angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('spsdb', {
        url: '/spsdb',
        template: '<spsdb></spsdb>',
        css: 'app/spsdb/spsdb.css'
      });
  });
