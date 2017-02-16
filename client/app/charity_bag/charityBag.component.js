'use strict';

  (function() {
    class CharityBagComponent {
    constructor($http, $scope) {
      this.$http = $http;
      this.$scope = $scope;

      this.output = "";
      this.calcTrips = [];
      this.donationTrips = [];
//        "date": new Date(),
//        "charity": "Goodwill Industries",
//        "bags": 6,
//        "added": true
//      }, {
//        "date": null,
//        "charity": "",
//        "bags": 0,
//        "added": false
//
//      }];
      // Uib datepicker stuff

      this.cbPopups = [];
      // { opened: false/true }

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
        this.cbPopups[index].opened = true;
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

//      this.addTrip = function(trip) {
        // Validations
//        if (!this.validateTrip(trip)) return;

//        trip.added = true;
//        this.donationTrips.push({
//          date: "",
//          charity: "",
//          bags: 0,
//          opened: false,
//          added: false
//        });
//      };

      this.newTrip = function() {
        this.cbPopups.push({ opened: false });
        this.donationTrips.push({
          date: new Date(),
          charity: "",
          bags: 0,
          added: false
        });



      };
      this.addOther = function(trip) {
        console.log("Adding other to trip: " + JSON.stringify(trip));
        if(trip.others) {
          trip.others.push({
            description: "",
            quantity: 1,
            value: 0,
            totalValue: 0
          })
        } else {
          trip.others= [{
            description: "",
            quantity: 1,
            value: 0,
            totalValue: 0
          }]
        }

      };

      this.calcOtherTotal = function(rec) {
        rec.totalValue = rec.quantity * rec.value;
      };

      this.backup = function() {
        var bkupData = {
          donationTrips: this.donationTrips
        };
        var c2String = angular.toJson(bkupData);

        this.$http({
          method: 'POST',
          url: '/api/backups/',
          data: {
            "c2_data": c2String,
            "bkfile": "charityBag_snapshot"
          }
        })
        .then(function successCallback(response) {
             alert("Backup Successful!\n\n" + response.data);
         }, function errorCallback(response) {
          // Handle the error
            alert("Backup failed with status: " + response.status);
          });

      };

      this.restore = function() {
        var ctrl = this;
        this.$http({
          method: 'GET',
          url: '/charityBag_snapshot.json'
        })
        .then(function successCallback(response) {
          ctrl.donationTrips = response.data.donationTrips;
          // De-serialize the dates
          for (var i=0; i<ctrl.donationTrips.length; i++) {
            var dateSerial = ctrl.donationTrips[i].date;
            if (dateSerial) {
               ctrl.donationTrips[i].date = new Date(dateSerial);
            }
          }
        }, function errorCallback(response) {
          alert("Request for restore yielded error: " + response.status);
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

         console.log("About to send: " + JSON.stringify(this.calcTrips));
        this.$http.post('/api/charity_bag', {
            "trips": this.calcTrips
           })
          .then(response => {
             console.log("Got data");
             //spsScope.output = data;
             var div = document.getElementById("report");
             div.innerHTML = response.data;

           }, function errorCallback(response) {
          // Handle the error
               alert("Request for charity bag server failed with status: (" + response.status + "): " + response.data);
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
