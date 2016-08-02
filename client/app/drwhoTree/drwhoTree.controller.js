'use strict';

(function() {

  angular.module('myappApp')
    .controller('drwhoTreeCtrl', ['$scope', '$http', function($scope, $http) {


      this.episodes = [];
      this.selItem = {};
      $scope.showShow = false;
      $scope.epEdit = false;
      $scope.editMode = false;

      $scope.featuring = [];
      $scope.questionMark = "-851px -417px";

      $scope.releaseDate = function(release) {
        if (isNaN(release)) {
          return release;
        }
        var utc_days = Math.floor(release - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);
        var months = ["Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Sept ", "Oct ", "Nov ", "Dec "];

        var month = months[(date_info.getMonth() + 1)];
        if (month) {
          return month + date_info.getFullYear();
        } else {
          return "Jan " + date_info.getFullYear();
        }

      };

      var treeCtlScope = $scope;

      $http({
        method: 'GET',
        url: 'drwho_tv_tree.json'
      }).success(function(data) {
        //alert("Got data ");
        treeCtlScope.list = data;
      });

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
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };
      $scope.myExpandAll = function(scope) {
        $scope.$broadcast('angular-ui-tree:expand-all');
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


      $scope.itemSelect = function(scope) {
        $scope.selItem = scope.$modelValue;
        $scope.featuring = $scope.selItem.Featuring.split(", ");

        if ($scope.selItem.Doctor) {
          //alert("Selected item:  " + $scope.selItem.name);
          //$scope.episodes = $scope.selItem.episodes;
          $scope.showShow = true;
        } else {
          $scope.showShow = false;
        }
      };

      $scope.showJSONstuff = function() {
        $scope.showJSON = true;
      };
      $scope.doneJSON = function() {
        $scope.showJSON = false;
      };

      $scope.nextItem = function () {

  		   if ($scope.listIndex == ($scope.list.length - 1)) {
  		       $scope.listIndex = 0;
  		   } else {
  		       $scope.listIndex++;
  		   }

  		   $scope.setSelectItem($scope.list.items[$scope.listIndex]);
      };

      $scope.prevItem = function () {
      	if ($scope.listIndex == 0) {
      	    $scope.listIndex = $scope.list.length - 1;
      	} else {
      	    $scope.listIndex--;
      	}
      	$scope.setSelectItem($scope.list.items[$scope.listIndex]);
      };


    }]); // end controller
})();
