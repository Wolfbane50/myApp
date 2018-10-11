'use strict';

(function() {
  class FindidsComponent {
    constructor($http, $state, $scope) {
      this.$http = $http;
      this.$state = $state;
      this.$scope = $scope;
      this.idsList = [];
      this.results = [];
      this.b10ifs = {};
      this.searchString = "";

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
        this.results = [];
        // Assume search term is regex
        var term = this.searchString;
        var patt = new RegExp(term, "i");
        angular.forEach(this.idsList, function(dirRec) {
          var dir = dirRec.dir;
          angular.forEach(dirRec.docs, function(doc) {
            if (patt.test(doc)) {
              scope.results.push({
                "dir": dir,
                "doc": doc
              });
            }
          });
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

    } // end constructor


    $onInit() {
      console.log("Instantiating find_idsComponent");
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
        console.log("Response from b10 ifs: " + JSON.stringify(response.data));
      }, function errorCallback(response) {
        alert("Request for B10 Interfaces data yielded error: " + response.status);
      });
      this.$http.get('ffg_interfaces.json', {
        cache: true
      }).then(response => {
        //alert("Got c2 tree data ");
        this.ffgifs = response.data;
        console.log("Response from b10 ifs: " + JSON.stringify(response.data));
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