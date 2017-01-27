angular.module('myappApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise("/default");

    $stateProvider
      .state('techBooks', {
        url: '/techBooks',
        component: 'techBooksComponent'
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
    .state('techBooks.publishers', {
      url: '/publishers',
      templateUrl: 'app/techBooks/publishers.html',
      controller: 'publishersController'
    })
    .state('techBooks.taggedDocs', {
      url: '/taggedDocs/:tag',
      templateUrl: 'app/techBooks/taggedDocs.html',
      controller: 'taggedDocsController'
    })
    .state('techBooks.document', {
      params: {
        id: null,
        doc: null
      },
      url: '/document/:id',
      templateUrl: 'app/techBooks/document.html',
      controller: function($scope, $stateParams, $state) {
        console.log("In document controller, stateParams = " + JSON.stringify($stateParams));
        if ($stateParams.doc) {
            console.log("Starting document view with passed document...");
            $scope.itemSelect($stateParams.doc);
        } else {
          if($stateParams.id) {
            console.log("Starting document view with passed id...");
            $scope.itemSelect($scope.findDocFromList($stateParams.id));
          } else {
            $state.go('techBooks.default');
          }

        }
      }
    })
    .state('techBooks.stageDocument', {
      url: '/document/:index',
      templateUrl: 'app/techBooks/document.html',
      controller: function($scope, $stateParams) {
        // Need to move this out into its own file
        var rec = $scope.stageDocs[$stateParams.index];
        console.log("In stage document controller");
        $scope.itemSelect(rec);
      }
    })
      .state('techBooks.default', {
        url: '/default',
        template: '<img src="assets/images/phanatic_in_suit.jpg" >'
      });

  });
