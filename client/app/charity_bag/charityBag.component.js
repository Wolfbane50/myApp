'use strict';

  (function() {
    class CharityBagComponent {
    constructor($http, $scope) {
      this.$http = $http;
      this.$scope = $scope;

      this.output = "";
      this.calcTrips = [];
      this.donationTrips = [{
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
      this.popup1 = {
        opened: false
      };
      this.cbPopups = [ {
        opened: false
      } ];

      this.dateOptions = {
  //      dateDisabled: disabled,
  //      formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(1990, 1, 1) // Will not be appropriate when done with videos
  //      startingDay: 1
      };

        this.dateFormat = 'dd-MMMM-yyyy';
      //  this.dateFormat = 'M!/d!/yyyy';


      // define all functions
      this.open1 = function(index) {
        console.log("open1 - " + index);
        this.donationTrips[index].opened = true;
      };

      this.cbopen = function(index) {
        console.log("Calling cbopen with index " + index);
        if(this.cbPopups[index]) {
          this.cbPopups[index].opened = true;
        } else {
          this.cbPopups[index] = { opened : true }
        }
      };

      this.validateTrip = function(trip) {
        var pattern = /\S+/;
        if (!pattern.test(trip.charity)) {
          alert("Must Specify a charity!");
          return false;
        }
        //pattern = /^\d\d\/\d\d\/\d\d$/;
        //if (!pattern.test(trip.date))
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

      this.addTrip = function(trip) {
        // Validations
        if (!this.validateTrip(trip)) return;

        trip.added = true;
        this.donationTrips.push({
          "date": "",
          "charity": "",
          "bags": 0,
          "added": false
        });

      };

      this.calculate = function() {
        // Validate all the rows
        this.calcTrips = [];
        //for (var trip in this.donationTrips)
        for (var i = 0; i < this.donationTrips.length; i++) {
          var trip = this.donationTrips[i];
          if (trip.added) {
            if (!this.validateTrip(trip)) return;
            this.calcTrips.push({
              "date": trip.date,
              "charity": trip.charity,
              "bags": trip.bags
            });
          }
        }
        //this.output = JSON.stringify(this.calcTrips);
        this.$http.post('/api/charity_bag', {
          data: {
            "trips": this.calcTrips
          } })
          .then(response => {
             console.log("Got data");
             //spsScope.output = data;
             var div = document.getElementById("report");
             div.innerHTML = response.data;

           }, function errorCallback(response) {
          // Handle the error
               alert("Request for charity bag server failed with status: " + response.status);
          });
      };
    }  // end constructor

    $onInit() {
    } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('charityBagComponent', {
      templateUrl: 'app/charity_bag/charityBag.html',
      controller: CharityBagComponent
    });

})();
