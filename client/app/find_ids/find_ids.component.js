'use strict';

(function() {
  class FindidsComponent {
    constructor($http, $state, $scope, $uibModal) {
      this.$http = $http;
      this.$state = $state;
      this.$scope = $scope;
      this.$uibModal = $uibModal;

      this.idsList = [];
      this.results = [];
      this.b10ifs = {};
      this.ffg_if_recs = {};
      this.searchString = "";
      this.message = "Have not searched yet."
      this.editRec = {};

      //=================================
      // Scope methods
      //=================================
      this.showJSONstuff = function() {
        this.showJSON = true;
      };

      this.doneJSON = function() {
        this.showJSON = false;
      };

      this.search = function() {
        var scope = this;
        this.message = "Searching...";
        this.results = [];
        // Assume search term is regex
        var term = this.searchString;
        //         var patt = new RegExp(term, "i");
        //         angular.forEach(this.idsList, function(dirRec) {
        //           var dir = dirRec.dir;
        //          angular.forEach(dirRec.docs, function(doc) {
        //            if (patt.test(doc)) {
        //              scope.results.push({
        //                "dir": dir,
        //                "doc": doc
        //              });
        //            }
        //          });
        this.$http.get('/api/ids', {
          params: {
            term: term
          }
        }).then(response => {
          //alert("Got c2 tree data ");
          this.results = response.data;
          this.message = "No Results Returned";
          console.log("Results from search: " + JSON.stringify(response.data));
        }, function errorCallback(response) {
          alert("Request for FFG Interfaces data yielded error: " + response.status);
        });

        //          this.results = [
        //            {
        //              "dir" : "S:/DLGR15/SSC/FF Work In Progress/Interfaces/Other Related Program Specs/IFF",
        //              "doc" : "WS35603_31December2012.pdf"
        //            } , {
        //              "dir" : "C:/Users/daniel.heaney/Documents/AMOD/IDS",
        //              "doc" : "35430 PRELIM 1.pdf"
        //            }
        //          ];
      };
      this.searchTerm = function(term) {
        var patt = new RegExp(/^NA/);
        if (patt.test(term)) {
          this.searchString = "NA";
          this.results = [];
        } else {
          this.searchString = term.replace(/WS-/i, '');
          this.search();
        }

      };

      this.editRecord = function(elem, if_index) {
        var if_array = this.ffg_if_recs[elem];
        this.editRec = if_array[if_index];
        alert("Editing " + this.editRec.name + " : " + this.editRec.idsName);
        var ctrl = this;
        var modalInstance = $uibModal.open({
          templateUrl: 'editIdsModal.html',
          controller: 'editIdsModalCtrl',
          size: 'sm',
          resolve: {
            updateRec: function() {
              console.log("resolving updateRec");
              return ctrl.editRec;
            }
          }
        });

        modalInstance.result.then(function(updatedRec) {
          console.log("Modal Result: updatedRec = " + JSON.stringify(updatedRec));
        });
      };

    } // end constructor


    $onInit() {
      console.log("Instantiating find_idsComponent yeah yeah yeah");
      this.$http.get('ids.json', {
        cache: true
      }).then(response => {
        //alert("Got c2 tree data ");
        this.idsList = response.data;
      }, function errorCallback(response) {
        alert("Request for IDS data yielded error: " + response.status);
      });
      this.$http.get('bl10_interfaces.json', {
        cache: true
      }).then(response => {
        //alert("Got c2 tree data ");
        this.b10ifs = response.data;
        //console.log("Response from b10 ifs: " + JSON.stringify(response.data));
      }, function errorCallback(response) {
        alert("Request for B10 Interfaces data yielded error: " + response.status);
      });
      this.$http.get('ffg_interfaces.json', {
        cache: true
      }).then(response => {
        //alert("Got c2 tree data ");
        this.ffgifs = response.data;
        //console.log("Response from b10 ifs: " + JSON.stringify(response.data));
      }, function errorCallback(response) {
        alert("Request for FFG Interfaces data yielded error: " + response.status);
      });
      this.$http.get('newffg_interfaces.json', {
        cache: true
      }).then(response => {
        //alert("Got c2 tree data ");
        this.ffg_if_recs = response.data;
        //console.log("Response from ffg ifs: " + JSON.stringify(response.data));
      }, function errorCallback(response) {
        alert("Request for FFG Interfaces data yielded error: " + response.status);
      });

    } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('findidsComponent', {
      templateUrl: 'app/find_ids/find_ids.html',
      controller: FindidsComponent
    });

})();
