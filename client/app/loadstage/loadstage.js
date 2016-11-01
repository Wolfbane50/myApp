angular.module('myappApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('loadstage', {
        url: '/loadstage',
        template: '<loadstage></loadstage>',
        css: 'app/loadstage/loadstage.css'
      })
      .state('loadstage.stageDocument', {
        url: '/document/:index',
        templateUrl: 'app/loadstage/document.html',
        controller: function($scope, $stateParams, $state) {
          // Need to move this out into its own file
          var rec = $scope.stageDocs[$stateParams.index];
          if (! rec) {
            console.log("Trying to select non-existent document");
              $state.go('loadstage.default');
          }
          $scope.selectedIndex = $stateParams.index;
          console.log("In stage document controller");
          $scope.itemSelect(rec, $stateParams.index);
        }
      })
      .state('loadstage.displayResults', {
        url: '/stageResults',
        templateUrl: 'app/loadstage/stageResults.html'

      })
      .state('loadstage.default', {
        url: '/default',
        template: '<img src="assets/images/doubt.png" >'
      });
  });
