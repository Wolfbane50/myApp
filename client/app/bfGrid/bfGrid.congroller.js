'use strict';

(function(){

class bfGridComponent {
  constructor($http, $scope) {
    this.$http = $http;
    this.audioList = [];
    this.ciFilter = "";

    this.gotIt = function (record) {
         if ((record.Fname) || (record.Chapters)) {
             return "check.png";
         } else {
           return "";
         }
    };
    this.gotItClass = function (record) {
         if ((record.Fname) || (record.Chapters)) {
           console.log("returning checked");
           return {
                   "background-image" : "url(check.png)",
                        "width" : "32px",
                        "height" : "32px"
            };
         } else {
            return {
                        "background-color" : "DARKGRAY",
                        "width" : "32px",
                        "height" : "32px"
            };
         }
     };
  }

  $onInit() {
    console.log("Requesting BF Data");
     this.$http.get('bigFinish.json', { cache : true } ).then(response => {
       this.audioList = response.data;
        console.log("Got BF Data");
     }).error(function(data, status, headers, config) {
     // Handle the error
        alert("Request for bigFinish.json yielded error: " + status);
     });
   }
}

angular.module('myappApp')
  .component('bfGrid', {
    templateUrl: 'app/bfGrid/bfGrid.html',
    controller: bfGridComponent,
    controllerAs: 'bfGridCtrl'
  });

})();
