'use strict';

(function() {
  class CharityReportComponent {
    constructor() {
      this.tripRecords = [];
      // define all functions
    } // end constructor


    $onInit() {
      function datestringIsEqual(dt, dtstring) {
        // Date string format: 3 January 2016
        var monthMap = {
          'January': 0,
          'February': 1,
          'March': 2,
          'April': 3,
        'May': 4,
          'June': 5,
          'July': 6,
          'August': 7,
          'September': 8,
          'October': 9,
          'November': 10,
          'December': 12
        };
        var parsable = dtstring.replace(/\D/g, " ");
        var dtcomps = dtstring.split(" ");
        //console.log("Checking " + parseInt(dtcomps[2]) + " against " + dt.getFullYear());
        //console.log("Checking " + monthMap[dtcomps[1]] + " against " + dt.getMonth());
        //console.log("Checking " + parseInt(dtcomps[0]) + " against " + dt.getDate());
        if ((parseInt(dtcomps[2]) === dt.getFullYear()) &&
           (monthMap[dtcomps[1]] === dt.getMonth()) &&
           (parseInt(dtcomps[0]) === dt.getDate()))
        {
//             console.log("Date is equal");
          return true;
         } else {
           return false;
         }
      }
      //console.log("Bag report: " + JSON.stringify(this.bagReport));
      //console.log("Trips: " + JSON.stringify(this.trips));

      function findBagReport(trip, ctrl) {
        for (var i = 0; i < ctrl.bagReport.trips.length; i++) {
          var report = ctrl.bagReport.trips[i];
          if ((datestringIsEqual(trip.date, report.date)) && (trip.charity === report.charity) && (trip.bags === report.bags)) {
            return bagReports[i];
          }
        }
        return null;
      }
      // make a copy of the trips, since they could change before next submit
      this.tripRecords = angular.copy(this.trips);
      // Walk records and assign refernce to calculated bags
      var runningIdx = 0;
      var ctrl = this;
      angular.forEach(this.tripRecords, function(trip) {
        var report = null;
        if (trip.bags > 0) {
          // Running index should point to correct records
          report = ctrl.bagReport.trips[runningIdx];

          if ((datestringIsEqual(trip.date, report.date)) && (trip.charity === report.charity) && (trip.bags === report.bags)) {
            runningIdx++;
          } else {
            console.log("No match runningIdx ");
            console.log("    trip: { date: " + trip.date + ", charity: " + trip.charity + ", bags: " + trip.bags + " }");
            console.log("    report: { date: " + report.date + ", charity: " + report.charity + ", bags: " + report.bags + " }");
            report = findBagReport(trip, ctrl);
          }
        }
        trip.grandTotal = 0;
        if (trip.others) {
          for (var i = 0; i < trip.others.length; i++) {
            trip.grandTotal = trip.grandTotal + trip.others[i].totalValue;
          }
        }
        if (report) {
          trip.items = report.items;
          trip.grandTotal = trip.grandTotal + parseFloat(report.total);
        }
      });
    } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('charityReport', {
      templateUrl: 'app/charity_bag/charityReport.html',
      bindings: {
        bagReport: '<',
        trips: '<'
      },
      controller: CharityReportComponent
    });

})();
