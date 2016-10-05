angular.module('myappApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise("/default");

    $stateProvider
      .state('techBooks', {
        url: '/techBooks',
        template: '<tech-books></tech-books>',
        css: 'app/techBooks/techBooks.css'
      })
      .state('techBooks.tagCloud', {
        url: '/tagCloud',
        templateUrl: 'app/techBooks/tagCloud.html',
        controller: 'tagCloudController'
      })
    .state('techBooks.categories', {
      url: '/categories',
      templateUrl: 'app/techBooks/categories.html',
      controller: 'categoriesController'
    })
    .state('techBooks.taggedDocs', {
      url: '/taggedDocs/:tag',
      templateUrl: 'app/techBooks/taggedDocs.html',
      controller: 'taggedDocsController'
    })
    .state('techBooks.document', {
      url: '/document/:id',
      templateUrl: 'app/techBooks/document.html',
      controller: function($scope, $stateParams) {
        console.log("In document controller");
        $scope.itemSelect($scope.findDocFromList($stateParams.id));
      }
    })
      .state('techBooks.default', {
        url: '/default',
        template: '<img src="assets/images/phanatic_in_suit.jpg" >'
      });

  });
