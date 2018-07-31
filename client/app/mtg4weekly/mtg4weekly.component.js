'use strict';

(function() {

  class Mtg4weeklyComponent {
    constructor($window, $http, $state) {
      this.$window = $window;
      this.$http = $http;
      this.$state = $state;
      this.emailId = "john.hurnyak.ctr@navy.mil";
      this.place = "";
      this.date = new Date();
      this.purpose = "";
      this.ddInput = "None";
      this.deliverables = "None";
      this.participants ="";
      this.title="";

      // Pre-stage
      this.place = "Washington, DC";
      this.ddInput = "None from FFG(X) team.  Attending meeting primarily for Situational Awareness";
      this.purpose = "Review progress of AEGIS Weapon System Software Development.  FFG(X) will leverage these developments and the SWIR process with the Frigate Weapon System development.";
      this.participants = "PEO IWS 1.0\nMissile Defense Agency (MDA)\nPEO IWS 8.0";
      this.title = "AEGIS Baseline 10 Software Increment Review (SWIR)";
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
      this.sendToJohn = function() {
        // Validate

        var message = "Meeting: " + this.title + "%0D%0A" +
	"Date: " + this.date + "%0D%0A" +
	"Purpose: " + this.purpose + "%0D%0A" +
	"DD's input:" + this.ddInput + "%0D%0A" +
	"Deliverables: " + this.deliverables + "%0D%0A" +
	"Key participants: " + this.participants +  "%0D%0A" +
	"Location: " + this.place +  "%0D%0A";
        this.$window.open("mailto:"+ this.emailId + "?subject=Meeting for FFG Weekly" +"&body=" + message,"_self");
      };

    }
  }

  angular.module('myappApp')
    .component('mtg4weeklyComponent', {
      templateUrl: 'app/mtg4weekly/mtg4weekly.html',
      controller: Mtg4weeklyComponent
    });

})();
