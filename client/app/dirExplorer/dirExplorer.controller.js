'use strict';

(function() {

  angular.module('myappApp')
    .controller('dirExplorerCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.showJSON = false;

      this.selItem = {};
      var treeCtlScope = $scope;

      //var dirDataStr = localStorage.getItem("dir_list");
    //  if (dirDataStr) {
    //    alert("Getting data from local store");

    //    treeCtlScope.list = angular.fromJson(dirDataStr);
    //  } else {
        $http.get('dir_data_hier.json', { cache : true } ).then(function successCb(response) {

           console.log("Got Directory Data");
           treeCtlScope.list = response.data;
        }, function errorCb(response) {
        // Handle the error
           alert("Request for bigFinish.json yielded error: " + response.status);
        });

      }

      $scope.selectedItemClass = function(scope) {
        var nodeData = scope.$modelValue;
        if ($scope.selItem == nodeData) {
          return 'dhitem-selected';
        } else {
          return 'dhitem';
        }
      };

      $scope.itemIcon = function(scope) {
        if (scope.hasChild()) {
          return scope.collapsed ? 'glyphicon-folder-close' : 'glyphicon-folder-open';
        } else {
          return 'glyphicon-file';
        }
      };

      $scope.selectedItem = {};

      $scope.options = {};

      $scope.myCollapseAll = function(scope) {
        scope.collapseAll();
      };
      $scope.myExpandAll = function(scope) {
        scope.expandAll();
      };
      $scope.sureRemove = function(scope) {
        if (confirm("Are you sure you want to delete this node?")) {
          scope.remove();
        }
      };

      $scope.toggle = function(scope) {
        scope.toggle();
      };

      $scope.newSubItem = function(scope) {
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

      $scope.bulkAdd = function(entries) {
        if ($scope.selItem.items == null) {
          $scope.selItem.items = [];
        }
        for (var i = 0; i < entries.length; i++) {

          $scope.selItem.items.push({
            //id: nodeData.id * 10 + nodeData.items.length,
            id: new Date(),
            name: entries[i],
            items: []
          });
        }

      };

      $scope.macroAdd = function() {
        var dirs = ["lib", "include", "bin"];
        $scope.bulkAdd(dirs);
      };

      $scope.addlist = "";
      $scope.addFromList = false;
      $scope.arrayAdd = function() {
        $scope.addlist = "";
        $scope.addFromList = true;

      };

      $scope.addListOK = function() {
        var newItems = $scope.addlist.split("\n");
        var logString = "";
        for (var i = 0; i < newItems.length; i++) {
          newItems[i] = newItems[i].trim();
          if (i) {
            logString += ", ";
          }
          logString += newItems[i];
        }
        alert("Adding " + logString);
        $scope.bulkAdd(newItems);

        $scope.addFromList = false;
      }

      $scope.addListCancel = function() {
        $scope.addFromList = false;
      }


      $scope.itemSelect = function(scope) {
        $scope.selItem = scope.$modelValue;
        //alert("Selected item:  " + $scope.selItem.name);

        // Create comments if they do not yet exist
        if (!$scope.selItem.comment) {
          $scope.selItem.comment = "No comment yet!";
        }
      };

      $scope.showJSONstuff = function() {
        $scope.showJSON = true;
      };
      $scope.doneJSON = function() {
        $scope.showJSON = false;
      };
      $scope.commitChanges = function() {
        var c2String = angular.toJson($scope.list)
        localStorage.setItem("dir_list", c2String);
        alert("Directory data saved to Local Storage");

      };
      $scope.flushLocal = function() {
        if (confirm("Are you really really sure you want to delete local storage?")) {
          localStorage.removeItem("dir_list");
          alert("Local Storage Deleted!");
        }
      };




    }]); // end controller
})();
