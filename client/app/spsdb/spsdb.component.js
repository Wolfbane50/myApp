'use strict';

(function() {
  class SpsdbComponent {
    constructor($http) {
      this.$http = $http;
      this.spsReqs = [];
      this.ciFilter = "";
      this.isRqt = false;
      this.isV1 = false;
      this.isSp1 = true;
      this.isSp2 = true;
      this.isSp3 = true;

      this.isRequirement = function(item) {
        return (item.ciatrequirement == "TRUE");
      };

      this.mySearch = function(item) {
        if (this.isRqt) {
          if (item.ciatrequirement != "TRUE") return false;
        }
        if (this.isV1) {
          if (item.ciatversion != "v1") return false;
        }
        return true;
      };

      this.spiralFilter = function(item) {
        if (!this.isV1) return true;
        if (item.ciatspiral == "all") return true;
        //if ((this.isSp1) && (item.ciatspiral =~ "1")) return true;
        //if ((this.isSp2) && (item.ciatspiral =~ "2")) return true;
        //if ((this.isSp3) && (item.ciatspiral =~ "3")) return true;
        return false;
      };

    } // end constructor

    $onInit() {
      this.$http.get('/api/parse_sps', { cache: true })
        .then(response => {
        //console.log("Got GDrive Data" + JSON.stringify(response.data));
        this.spsReqs = response.data.all.data;
      }, function errorCallback(response) {
        // Handle the error
        alert("Request for SPS data yielded error: " + response.status);
      });

    } // end onInit
  } // end component class

    angular.module('myappApp')
      .component('spsdbComponent', {
        templateUrl: 'app/spsdb/spsdb.html',
        controller: SpsdbComponent
      });

})();
