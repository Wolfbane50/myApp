'use strict';

(function() {
  class DirExplorerComponent {
    constructor($http, $scope) {
      this.showJSON = false;
      this.selItem = {};
      this.list = [];
      this.selectedItem = {};
      this.options = {};
      this.addlist = "";
      this.addFromList = false;

      this.$scope = $scope;
      this.$http = $http;

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


      this.myCollapseAll = function(scope) {
         this.$scope.$broadcast('angular-ui-tree:collapse-all');
      };
      this.myExpandAll = function(scope) {
        this.$scope.$broadcast('angular-ui-tree:expand-all');
      };
      this.sureRemove = function(scope) {
        if (confirm("Are you sure you want to delete this node?")) {
          scope.remove();
        }
      };

      this.toggle = function(scope) {
        scope.toggle();
      };

      this.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        if (nodeData.items == null) {
          nodeData.items = [];
        }

        var newName = prompt("Name of new item: ");
        nodeData.items.push({
          //id: nodeData.id * 10 + nodeData.items.length,
          id: new Date(),
          name: newName,
          items: []
        });
      };

      this.bulkAdd = function(entries) {
        if (this.selItem.items == null) {
          this.selItem.items = [];
        }
        for (var i = 0; i < entries.length; i++) {

          this.selItem.items.push({
            //id: nodeData.id * 10 + nodeData.items.length,
            id: new Date(),
            name: entries[i],
            items: []
          });
        }
      };

      this.macroAdd = function() {
        var dirs = ["lib", "include", "bin"];
        this.bulkAdd(dirs);
      };

      this.arrayAdd = function() {
        this.addlist = "";
        this.addFromList = true;

      };

      this.addListOK = function() {
        var newItems = this.addlist.split("\n");
        var logString = "";
        for (var i = 0; i < newItems.length; i++) {
          newItems[i] = newItems[i].trim();
          if (i) {
            logString += ", ";
          }
          logString += newItems[i];
        }
        alert("Adding " + logString);
        this.bulkAdd(newItems);

        this.addFromList = false;
      };

      this.addListCancel = function() {
        this.addFromList = false;
      };


      this.itemSelect = function(scope) {
        this.selItem = scope.$modelValue;
        //alert("Selected item:  " + this.selItem.name);

        // Create comments if they do not yet exist
        if (!this.selItem.comment) {
          this.selItem.comment = "No comment yet!";
        }
      };

      this.showJSONstuff = function() {
        this.showJSON = true;
      };
      this.doneJSON = function() {
        this.showJSON = false;
      };
      this.commitChanges = function() {
        var c2String = angular.toJson(this.list)
        localStorage.setItem("dir_list", c2String);
        alert("Directory data saved to Local Storage");

      };
      this.flushLocal = function() {
        if (confirm("Are you really really sure you want to delete local storage?")) {
          localStorage.removeItem("dir_list");
          alert("Local Storage Deleted!");
        }
      };
    } // end constructor
    $onInit() {
      console.log("dirExporer onInit");
      this.$http.get('dir_data_hier.json', {
         cache : true
       }).then(response => {

         console.log("Got Directory Data");
         this.list = response.data;
       }, function errorCallback(response) {
      // Handle the error
         alert("Request for dir_data_hier.json yielded error: " + response.status);
      });

    } // end onInit

  } // end component class

  angular.module('myappApp')
    .component('dirExplorerComponent', {
      templateUrl: 'app/dirExplorer/dirExplorer.html',
      controller: DirExplorerComponent
    });

})();
