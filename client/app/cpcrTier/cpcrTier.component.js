'use strict';

(function() {
  class CpcrTierComponent {
    constructor($http, $scope, ngToast) {
      this.$http = $http;
      this.$scope = $scope;
      this.ngToast = ngToast;
      this.cpcrs = [];
      this.selCpcr = {};
      this.selTier0 ={};
      this.selTier1 ={};
      this.selTier2 ={};
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

      this.tierDefs = {};
      this.selectedClass = function(index) {
        return (this.amISelected(index)) ? "userselected" : "";
      };

      this.amISelected = function(index) {
        if (index === this.selectedIndex) {
          return true;
        }
        return false;
      };
      this.getTier = function(key) {
        if (this.tierDefs[key]) {
          return this.tierDefs[key];
        } else {
          return {
            number: key,
            name: "Not Defined",
            definition: "No Data",
            proposeduse: "No Data"
          };
        }
      }

      this.select = function(cpcr, index) {
        this.selTier0 = this.getTier(cpcr.tier0);
        this.selTier1 = this.getTier(cpcr.tier0 + '.' + cpcr.tier1);
        this.selTier2 = this.getTier(cpcr.tier0 + '.' + cpcr.tier1 + '.' + cpcr.tier2);
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
      this.$http.get('cpcr_tier_review.json', {
          cache: true
        })
        .then(response => {
          console.log("Got Tier Data");
//          this.cpcrs = response.data.all.data;
          this.cpcrs = response.data;

        }, function errorCallback(response) {
          // Handle the error
          alert("Request for CPCR tier data yielded error: " + response.status);
        });
        this.$http.get('tierdef_hash.json', {
            cache: true
          })
          .then(response => {
            console.log("Got Tier Definitions:" + JSON.stringify(response.data));
              this.tierDefs = response.data;

          }, function errorCallback(response) {
            // Handle the error
            alert("Request for tier definitions yielded error: " + response.status);
          });


    } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('cpcrTierComponent', {
      templateUrl: 'app/cpcrTier/cpcrTier.html',
      controller: CpcrTierComponent
    });

})();
