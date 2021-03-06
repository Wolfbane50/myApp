'use strict';

(function(){

class BfGridComponent {
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
     }, function errorCallback(response) {
     // Handle the error
        alert("Request for bigFinish.json yielded error: " + response.status);
     });
   }
}

angular.module('myappApp')
  .component('bfGridComponent', {
    templateUrl: 'app/bfGrid/bfGrid.html',
    controller: BfGridComponent
  });

})();
