'use strict';

(function() {
    class NoncomplianceComponent {
      constructor($http, $state, $scope, ngToast) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.ngToast = ngToast;

        this.excelfile = "C:/Users/daniel.heaney/Documents/BL9on8/Non_Compliances.xlsx";
        this.noncomplianceLocation = "BL9on8/";
        this.excelData = {};
        this.originalColumns = [];
        this.columns = [];
        this.rows = [];
        this.lookupTable = {};

        //=================================
        // Scope methods
        //=================================
        this.showJSONstuff = function() {
             this.showJSON = true;
        };

        this.doneJSON = function() {
             this.showJSON = false;
        };

        this.clearLookupTable = function(ctrl) {
          var keys = Object.keys(ctrl.lookupTable);
          for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            ctrl.lookupTable[key] = false;
          }
        };

        this.getJsonData = function() {
          var ctrl = this;

          this.$http({
            url: '/api/excel2json',
            method: 'GET',
            params: {
              "excelfile": this.excelfile
            }
          }).then(response => {
            //alert("Got c2 tree data ");
            ctrl.excelData = response.data;
            var theKey = Object.keys(ctrl.excelData)[0];

            ctrl.originalColumns = ctrl.excelData[theKey].header.originalColumns;
            ctrl.columns = ctrl.excelData[theKey].header.columns;
            ctrl.rows = ctrl.excelData[theKey].data;

            // Build Lookup table
            for (var i=0; i<ctrl.rows.length; i++) {
              var rec = ctrl.rows[i];
              if (rec["non-complianceform"]) {
                 rec.link = ctrl.noncomplianceLocation + rec["non-complianceform"];
                 //console.log("Setting link to " + rec.link);
              }
              ctrl.lookupTable[rec.cpcr] = false;
            }




            }, function errorCallback(response) {
            alert("Request to convert Excel file returned error: " + response.status);
          });

        };

        this.updateFromMetrics = function() {
          this.clearLookupTable(this);
          var ctrl = this;

          // Should prompt user for this
          var metricsFile = "C:/Users/daniel.heaney/Documents/01-29-2018 BL 9A2A R1_SAFETY_CERT HIGH.xlsx";
          this.$http({
            url: '/api/doit',
            method: 'GET',
            params: {
              "file": metricsFile
            }
          }).then(response => {
            ctrl.ngToast.create("Excel File should open...");
          });

        };

      } // end constructor


      $onInit() {
        console.log("Instantiating noncomplianceComponent");
        this.getJsonData();
        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('noncomplianceComponent', {
          templateUrl: 'app/noncompliance/noncompliance.html',
          controller: NoncomplianceComponent
        });

    })();
