'use strict';

(function() {

  angular.module('myappApp')
  .controller('carddirsCtrl', ['$scope', '$http',  function($scope, $http) {
    var chachiScope = $scope;


    // http get the json file

    $http({
      method: 'GET',
      url: 'carddirs.json'
    }).then(function(data) {
      console.log('Got data');
    });
  }]); // end controller
})();
