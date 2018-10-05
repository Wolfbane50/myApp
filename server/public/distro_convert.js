(function() {
  'use strict';


  angular.module('demoApp', [])

  .controller('MainCtrl', [ '$scope', '$http',  '$timeout', function($scope, $http, $timeout ) {
  
     $scope.sourceString = "";
     $scope.cleanEmails = [];
     $scope.cleanString ="";
     
     $scope.convert = function() {
          
          var emailArray = $scope.sourceString.split(/;/);
          //console.log("emailArray => " + JSON.stringify(emailArray));
          $scope.cleanEmails = emailArray.map(function(value, index, array) {
              var clean = value.replace(/\'/g, '');
              if (clean.indexOf('<') == -1) {
                //console.log("No alias found in " + clean);
                return clean;
              } else {
                 clean = clean.slice(clean.indexOf('<') + 1, clean.indexOf('>'));
                 //console.log(value + " ==> " + clean );
                 return clean;
              }
          });
          $scope.cleanString = $scope.cleanEmails.join("; ");
          //$scope.cleanString = $scope.sourceString;
      };

  }]);



})();
