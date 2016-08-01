'use strict';

(function() {

  angular.module('myappApp')
    .controller('spsdbCtrl', ['$scope', '$http', function($scope, $http) {

      $scope.spsReqs = [];
      var spsScope = $scope;
      $scope.ciFilter = "";
      $scope.isRqt = false;
      $scope.isV1 = false;
      $scope.isSp1 = true;
      $scope.isSp2 = true;
      $scope.isSp3 = true;

      //    $http({ method: 'GET', url: 'sps_parsed.json' }).success(function(data) {
      //    $http({ method: 'GET', url: 'http://127.0.0.1:3000/parse_sps' }).success(function(data) {
      $http({
        method: 'GET',
        url: '/api/parse_sps',
        cache: true
      }).success(function(data) {
        console.log("Got data");
        spsScope.spsReqs = data.all.data;
      }).error(function(data, status, headers, config) {
        // Handle the error
        alert("Request for SPS data yielded error: " + status);
      });


      $scope.isRequirement = function(item) {
        return (item.ciatrequirement == "TRUE");
      };

      $scope.mySearch = function(item) {
        if ($scope.isRqt) {
          if (item.ciatrequirement != "TRUE") return false;
        }
        if ($scope.isV1) {
          if (item.ciatversion != "v1") return false;
        }
        return true;
      };

      $scope.spiralFilter = function(item) {
        if (!$scope.isV1) return true;
        if (item.ciatspiral == "all") return true;
        //if (($scope.isSp1) && (item.ciatspiral =~ "1")) return true;
        //if (($scope.isSp2) && (item.ciatspiral =~ "2")) return true;
        //if (($scope.isSp3) && (item.ciatspiral =~ "3")) return true;
        return false;
      };
    }]); // end controller
})();
