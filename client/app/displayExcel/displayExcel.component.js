'use strict';

(function() {
    class DisplayExcelComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;

        this.excelfile = "Heroes.xlsx";  // First cut: FAA sheet as an example
        this.skiprows = 0;
        this.excelData = {};
        this.originalColumns = [];
        this.columns = [];
        this.rows = [];
        this.controller

        //=================================
        // Scope methods
        //=================================
        this.showJSONstuff = function() {
             this.showJSON = true;
        };

        this.doneJSON = function() {
             this.showJSON = false;
        };
        this.getJsonData = function() {
          var ctrl = this;
          this.$http({
            url: '/api/excel2json',
            method: 'GET',
            params: {
              "excelfile": this.excelfile,
              "skiprows": this.skipRows
            }
          }).then(response => {
            //alert("Got c2 tree data ");
            ctrl.excelData = response.data;
            var theKey = Object.keys(ctrl.excelData)[0];

            ctrl.originalColumns = ctrl.excelData[theKey].header.originalColumns;
            ctrl.columns = ctrl.excelData[theKey].header.columns;
            ctrl.rows = ctrl.excelData[theKey].data;

            // Get pointed to first
            }, function errorCallback(response) {
            alert("Request to convert Excel file returned error: " + response.status);
          });

        };


      } // end constructor


      $onInit() {
        console.log("Instantiating displayExcelComponent");
        this.getJsonData();
        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('displayExcelComponent', {
          templateUrl: 'app/displayExcel/displayExcel.html',
          controller: DisplayExcelComponent
        });

    })();
