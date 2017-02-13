angular.module('myappApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('loadstage', {
        url: '/loadstage',
        redirectTo: 'loadstage.default',
        component: 'loadstageComponent'
      })
      .state('loadstage.docdisp', {
          component: 'libdoc',
          params: {
            document: null
          },
          resolve: {
            doc: function($transition$) {
              //console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
              return $transition$.params().document;
            }
         }
      })
      .state('loadstage.stageDocument', {
        url: '/document/:index',
        templateUrl: 'app/loadstage/document.html',
        controller: function($scope, $stateParams, $state) {
          // Need to move this out into its own file
          var rec = $scope.stageDocs[$stateParams.index];
          if (! rec) {
            //console.log("Trying to select non-existent document");
              $state.go('loadstage.default');
          }
          $scope.selectedIndex = $stateParams.index;
          //console.log("In stage document controller");
          $scope.itemSelect(rec, $stateParams.index);
        }
      })
      .state('loadstage.displayResults', {
        component: 'stageResults',
        params: {
          result: null
        },
        resolve: {
          result: function($transition$) {
            //console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().result;
          }
        }
      })
      .state('loadstage.default', {
        url: '/default',
        template: '<img src="assets/images/doubt.png" >'
      });
  });
