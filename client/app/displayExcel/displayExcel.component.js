'use strict';

(function() {
    class DisplayExcelComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;

        this.excelfile = "Heroes.xlsx";  // First cut: FAA sheet as an example
        this.skiprows = 0;
        this.startswith = "";
        this.mergeData = false;
        this.excelData = {};
        this.originalColumns = [];
        this.columns = [];
        this.rows = [];

        //=================================
        // Scope methods
        //=================================
        this.showJSONstuff = function() {
             this.showJSON = true;
        };

        this.doneJSON = function() {
             this.showJSON = false;
        };

        this.fileChange = function(ele) {
          console.log("In fileChange...");

          var filePath = URL.createObjectURL(ele[0]);
          console.log("Could send to " + filePath);
        }

        this.$scope.fileNameChanged = function (ele) {
          console.log("Got to fileNameChanged");
        }

        this.getJsonData = function() {
          var ctrl = this;
          var myParms = {
            "excelfile": this.excelfile
          };
          if (this.skipRows) {
            myParms.skiprows = this.skipRows;
          }
          if (this.startswith) {
            myParms.sheetStart = this.startswith;
          }
          if (this.mergeData) {
            myParms.mergeData = true;
          }
          console.log("Sending off to process excel file: " + this.excelfile + ", skip " + this.skipRows +
                       " rows, starts with " + this.startswith + "; Merge? " + this.mergeData);

          this.$http({
            url: '/api/excel2json',
            method: 'GET',
            params: myParms
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
