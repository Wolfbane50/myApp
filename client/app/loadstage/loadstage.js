angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('loadstage', {
        url: '/loadstage',
        template: '<loadstage></loadstage>',
        css: 'app/loadstage/loadstage.css'
      })
      .state('loadstage.stageDocument', {
        url: '/document/:index',
        templateUrl: 'app/loadstage/document.html',
        controller: function($scope, $stateParams) {
          // Need to move this out into its own file
          var rec = $scope.stageDocs[$stateParams.index];
          $scope.selectedIndex = $stateParams.index;
          console.log("In stage document controller");
          $scope.itemSelect(rec);
        }
      })
        .state('loadstage.default', {
          url: '/default',
          template: '<img src="assets/images/doubt.png" >'
        });
  });
