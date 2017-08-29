'use strict';

(function() {
  class CpcrTierComponent {
    constructor($http, ngToast) {
      this.$http = $http;
      this.ngToast = ngToast;
      this.cpcrs = [];
      this.selCpcr = {};
      this.showCpcr = false;
      this.elementFilter = "";
      this.selectedIndex = -1;
      this.elementPickList = [
        "ADS", "C&D", "MP", "WCS", "SPY", "TACTOE"
      ];
      this.showJSON = false;

      this.showJSONstuff = function() {
        this.showJSON = true;

      };

      this.doneJSON = function() {
        this.showJSON = false;
      };
      this.selectedClass = function(index) {
        return (this.amISelected(index)) ? "userselected" : "";
      };

      this.amISelected = function(index) {
        if (index === this.selectedIndex) {
          return true;
        }
        return false;
      };

      this.select = function(cpcr, index) {
        this.selCpcr = cpcr;
        this.showCpcr = true;
        this.selectedIndex = index;
      };
      this.cpcrFilter = function(cpcr) {
        if (this.elementFilter) {
          return this.elementFilter === cpcr.element;
        }
        return true;
      };
    } // end constructor

    $onInit() {
      var c2DataStr = localStorage.getItem("cpcrtiers");
      if (c2DataStr) {
        //alert("Getting data from local store");
        console.log("Using local store data");
        this.cpcrs = angular.fromJson(c2DataStr);
      } else {
        console.log("Off to server to get tier data");
        this.$http.get('/api/tier_ver', {
            cache: true
          })
          .then(response => {
            console.log("Got Tier Data");
            this.cpcrs = response.data.all.data;
            var c2String = angular.toJson(this.cpcrs);
            console.log("Caching tier data to local storage");
            localStorage.setItem("cpcrtiers", c2String);
            this.ngToast.create("CPCR Data saved to Local Storage");

          }, function errorCallback(response) {
            // Handle the error
            alert("Request for CPCR tier data yielded error: " + response.status);
          });

      }

    } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('cpcrTierComponent', {
      templateUrl: 'app/cpcrTier/cpcrTier.html',
      controller: CpcrTierComponent
    });

})();
