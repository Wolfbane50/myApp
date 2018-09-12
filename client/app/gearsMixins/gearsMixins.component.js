'use strict';

(function() {
  class GearsMixinsComponent {
    constructor($http, $state, $scope) {
      this.$http = $http;
      this.$state = $state;
      this.$scope = $scope;

      this.mixins = {};
      this.selItem = {};

      this.FFGApplicable = false;
      this.Bl10Applicable = false;
      this.otherApplicable = false;

      // Just a sample for now
      this.configurations = [ "None" ];
      this.configIndex = 0;
      this.configName = this.configurations[this.configIndex];

      //=================================
      // Scope methods
      //=================================
      this.showJSONstuff = function() {
        this.showJSON = true;
      };

      this.doneJSON = function() {
        this.showJSON = false;
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
        if (scope.hasChild()) {
          return scope.collapsed ? 'glyphicon-folder-close' : 'glyphicon-folder-open';
        } else {
          return 'glyphicon-file';
        }
      };

      this.myCollapseAll = function() {
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };
      this.myExpandAll = function() {
        $scope.$broadcast('angular-ui-tree:expand-all');
      };

      this.toggle = function(scope) {
        scope.toggle();
      };

      this.itemSelect = function(scope) {
        this.selItem = scope.$modelValue;
        //alert("Selected item:  " + this.selItem.name);
        this.FFGApplicable = (this.selItem["FFGX"]) ? true : false;
        this.Bl10Applicable = (this.selItem["AEGIS_BASELINE_10_C0_0_0_2G"]) ? true : false;
        this.otherApplicable = (this.selItem[this.configName]) ? true : false;
      };


    } // end constructor


    $onInit() {
      this.$http.get('mixins.json', {
        cache: true
      }).then(response => {
        //lert("Got c2 tree data ");
        this.mixins = response.data.items;
        this.configurations = response.data.applicableBaselines;
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
