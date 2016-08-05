angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('techBooks', {
        url: '/techBooks',
        template: '<tech-books></tech-books>',
        css: 'app/techBooks/techBooks.css'
      });
  });
