'use strict';

(function() {

  class ETComponent {
    constructor($window, $http, $state) {
      this.$window = $window;
      this.$http = $http;
      this.$state = $state;

      // Prototype Data
      this.topic = {
        id: 29,
        title: "Display of Radar video",
        description: "SPY has a requirement to provide video signals to ADS, but no such requirement exists in the AMDR TLR/TLRP",
        qer: "",
        answerStatus: "",
        bigRocks: "",
        status: 'open',
        targetDate: "",
        targetEvent: "SW PDR",
        planOfAction: [],
        poc: "Heaney",
        supportSMEs: "",
        stakeholders: [{
          org: "PEO IWS 1",
          desc: "AEGIS",
          name: "Adm. Small"
        }, {
          org: "PEO IWS 8",
          desc: "FFG(X) CS",
          name: "Shawn Barreto"
        }],
        log: [{
          date: "",
          status: "Created."
        }]


      }

      // Pre-stage
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
        if (this.cbPopups[index]) {
          this.cbPopups[index].opened = true;
        } else {
          this.cbPopups[index] = {
            opened: true
          }
        }
      };

    }
  }

  angular.module('myappApp')
    .component('eTComponent', {
      templateUrl: 'app/engineeringTopic/ET.html',
      controller: ETComponent
    });

})();
