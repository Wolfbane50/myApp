'use strict';

(function() {
    class GearsMixinsComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;

        this.mixins = {};

        //=================================
        // Scope methods
        //=================================
        this.showJSONstuff = function() {
             this.showJSON = true;
        };

        this.doneJSON = function() {
             this.showJSON = false;
        };
      } // end constructor


      $onInit() {
        this.$http.get('mixins.json', {
          cache: true
        }).then(response => {
        //alert("Got c2 tree data ");
           this.mixins = response.data;
        }, function errorCallback(response) {
            alert("Request for mixins data yielded error: " + response.status);
        });
        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('gearsMixinsComponent', {
          templateUrl: 'app/gearsMixins/gearsMixins.html',
          controller: GearsMixinsComponent
        });

    })();
