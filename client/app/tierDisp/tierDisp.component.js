'use strict';

(function() {
    class TierDispComponent {
      constructor($http, $scope, ngToast) {
        this.$http = $http;
        this.$scope = $scope;
        this.ngToast = ngToast;
        this.tierHier = [];
        this.selTier = null;

        this.itemSelect = function(scope) {
          this.selTier = scope.$modelValue;
        };

        this.selectedItemClass = function(scope) {
          var nodeData = scope.$modelValue;
          if (this.selItem == nodeData) {
            return 'dhitem-selected';
          } else {
            return 'dhitem';
          }
        };

        this.itemIcon = function(scope) {
          if (scope.hasChild) {
            if (scope.hasChild()) {
              return scope.collapsed ? 'glyphicon-folder-close' : 'glyphicon-folder-open';
            } else {
              return 'glyphicon-file';
            }
          } else {
            console.log("itemIcon: scope.hasChild does not exist")
          }
        };
        this.myCollapseAll = function() {
          this.$scope.$broadcast('angular-ui-tree:collapse-all');
        };

        this.myExpandAll = function() {
          this.$scope.$broadcast('angular-ui-tree:expand-all');
        };
        this.toggle = function(scope) {
          scope.toggle();
        };

      } // end constructor

        $onInit() {
          this.$http.get('tierdef_hier.json', {
              cache: true
            })
            .then(response => {
              console.log("Got Tier Data");
              //          this.cpcrs = response.data.all.data;
              this.tierHier = response.data;

            }, function errorCallback(response) {
              // Handle the error
              alert("Request for tier hierarchy data yielded error: " + response.status);
            });

        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('tierDispComponent', {
          templateUrl: 'app/tierDisp/tierDisp.html',
          controller: TierDispComponent
        });

    })();
