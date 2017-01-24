'use strict';

(function() {
    class GdriveIdTableComponent {
      constructor($http) {
        this.$http = $http;
        this.items = [];

      } // end constructor

      $onInit() {
        this.$http.get('/api/newCards/drive')
          .then(response => {
          //console.log("Got GDrive Data" + JSON.stringify(response.data));
          this.items = response.data;
        }, function errorCallback(response) {
          // Handle the error
          alert("Request for /api/newCards/drive yielded error: " + response.status);
        });

      } // end onInit
    } // end component class

    angular.module('myappApp')
      .component('gdriveidTableComponent', {
        templateUrl: 'app/gdriveIdTable/gdriveidTable.html',
        controller: GdriveIdTableComponent
      });

})();
