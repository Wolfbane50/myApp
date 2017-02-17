'use strict';

(function() {
  class CharityReportComponent {
  constructor() {
   this.tripRecords = [];
    // define all functions
  }  // end constructor

  $onInit() {
    // make a copy of the trips, since they could change before next submit
    this.tripRecords = angular.copy(this.trips);

    // Walk records and assign refernce to calculated bags
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
