'use strict';

(function() {

  angular.module('myappApp')
    .controller('carddirModalCtrl', function($scope, $uibModalInstance, updateDt) {

      $scope.updateDt = updateDt;

      $scope.ok = function() {
        $uibModalInstance.close($scope.updateDt);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

    }); // end controller
})();
