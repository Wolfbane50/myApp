'use strict';

(function() {

  angular.module('myappApp')
    .controller('charityBagCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.output = "";
      $scope.calcTrips = [];
      $scope.donationTrips = [{
        "date": new Date(),
        "charity": "Goodwill Industries",
        "bags": 6,
        "added": true
      }, {
        "date": null,
        "charity": "",
        "bags": 0,
        "added": false

      }];
      // Uib datepicker stuff
      $scope.popup1 = {
        opened: false
      };

      $scope.open1 = function(index) {
        console.log("open1 - " + index);
        $scope.donationTrips[index].opened = true;
      };



      $scope.cbPopups = [ {
        opened: false
      } ];


      $scope.cbopen = function(index) {
        console.log("Calling cbopen with index " + index);
        if($scope.cbPopups[index]) {
          $scope.cbPopups[index].opened = true;
        } else {
          $scope.cbPopups[index] = { opened : true }
        }
      };



      $scope.dateOptions = {
  //      dateDisabled: disabled,
  //      formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(1990, 1, 1) // Will not be appropriate when done with videos
  //      startingDay: 1
      };

        $scope.dateFormat = 'dd-MMMM-yyyy'
      //  $scope.dateFormat = 'M!/d!/yyyy';

      var spsScope = $scope;

      $scope.validateTrip = function(trip) {
        var pattern = /\S+/;
        if (!pattern.test(trip.charity)) {
          alert("Must Specify a charity!");
          return false;
        }
        //pattern = /^\d\d\/\d\d\/\d\d$/;
        //if (!pattern.test(trip.date)) {
        if(!angular.isDate(trip.date)) {
          alert("Must Specify a valid Date! \n You input >>" + trip.date + "<<");
          return false;
        }
        if (trip.bags < 1) {
          alert("Must have at least 1 bag!");
          return false;
        }
        if (trip.bags > 20) {
          alert("More than 20 bags is a bit unreasonable!");
          return false;
        }
        return true;
      };

      $scope.addTrip = function(trip) {
        // Validations
        if (!$scope.validateTrip(trip)) return;

        trip.added = true;
        $scope.donationTrips.push({
          "date": "",
          "charity": "",
          "bags": 0,
          "added": false
        });

      };

      $scope.calculate = function() {
        // Validate all the rows
        $scope.calcTrips = [];
        //for (var trip in $scope.donationTrips) {
        for (var i = 0; i < $scope.donationTrips.length; i++) {
          var trip = $scope.donationTrips[i];
          if (trip.added) {
            if (!$scope.validateTrip(trip)) return;
            $scope.calcTrips.push({
              "date": trip.date,
              "charity": trip.charity,
              "bags": trip.bags
            });
          }
        }
        //$scope.output = JSON.stringify($scope.calcTrips);
        $http({
          method: 'POST',
          url: '/api/charity_bag',
          data: {
            "trips": $scope.calcTrips
          }
        }).success(function(data) {
          console.log("Got data");
          //spsScope.output = data;
          var div = document.getElementById("report");
          div.innerHTML = data;

        }).error(function(data, status, headers, config) {
          // Handle the error
          alert("Request for charity bag server failed with status: " + status);
        });



      };



    }]); // end controller
})();
