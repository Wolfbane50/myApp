'use strict';

(function() {

  angular.module('myappApp')
    .controller('carddirsCtrl', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

      $scope.showJSON = false;
      $scope.showSel = false;
      //$scope.editDoc = {};
      this.selItem = {};
      $scope.cardTree = [];
      var treeCtlScope = $scope;
      this.selItem = {};
      $scope.showShow = false;
      $scope.jsonTable = false;
      $scope.checkedItems = [];
      function cardTreeFromJson(data) {
        var seriesIncr = 50000;
        var dirLookup = {};

        // Walk the data and create a hierarchical list
        var cardList = data;

        cardList.forEach(function(element, index, array) {
          var targetList;
          var inPath = element.path;
          console.log("Input path = " + element.path);
          var path = inPath.substring(2, inPath.length);
          //var path = inPath;
          var inFname = element.fname;

          element.checked = false;
          if (dirLookup[path]) {
            targetList = dirLookup[path];
            targetList.items.push(element);
            //console.log("adding " + inFname + " to " + path);
          } else {
            targetList = {
              "path": path,
              "id": seriesIncr++,
              "items": [element]
            };
            //console.log("Starting  " + path + " with " + inFname);
            dirLookup[path] = targetList;
            treeCtlScope.cardTree.push(targetList);
          }
        });
      }

      var c2DataStr = localStorage.getItem("cardTree");
      if (c2DataStr) {
        //alert("Getting data from local store");

        $scope.cardTree = angular.fromJson(c2DataStr);
      } else {
        $http({
          method: 'GET',
          url: 'carddirs.json'
        }).then(function successCallback(response) {
          //alert("Got data ");
            cardTreeFromJson(response.data);

        }, function errorCallback(response) {
          alert("Request for New Cards data yielded error: " + response.status);
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

      $scope.options = {
        "data-drag-enabled": false
      };

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
          docs: [],
          items: []
        });
      };


      $scope.itemSelect = function(scope) {
        $scope.selItem = scope.$modelValue;
        $scope.path = $scope.selItem['path'];
        //alert("Selected item:  " + $scope.selItem.path);
        if (($scope.selItem.fname) && ($scope.selItem.name)) {
          $scope.name = $scope.selItem.name;
        } else {
          $scope.name = "";
        }

        if (($scope.selItem.fname) && ($scope.selItem.brand)) {
          $scope.brand = $scope.selItem.brand;
        } else {
          $scope.brand = "";
          $scope.selItem.brand = "";
        }
        if (($scope.selItem.fname) && ($scope.selItem.type)) {
          $scope.type = $scope.selItem.type;
        } else {
          $scope.type = "";
          $scope.selItem.type = "";
        }
        if (($scope.selItem.fname) && ($scope.selItem.team)) {
          $scope.team = $scope.selItem.team;
        } else {
          $scope.team = "";
          $scope.selItem.team = "";
        }
      };

      $scope.applyFolder = function() {
        alert("Apply tags to " + $scope.path);
        $scope.cardTree.forEach(function(sublist, index, array) {
          if (sublist.path == $scope.path) {
            sublist.items.forEach(function(element, index2, array2) {
              if ($scope.selItem.team) {
                element.team = $scope.selItem.team;
              }
              if ($scope.selItem.brand) {
                element.brand = $scope.selItem.brand;
              }
              if ($scope.selItem.type) {
                element.type = $scope.selItem.type;
              }
            });
          }
        });
      };


      var processChecked = function(method, successCb, errCb) {
        var checkedItems = $scope.checkedItems;
        if (checkedItems.length == 0) {
          alert("Sorry!  No items were selected.");
          return;
        }

        //var cardString = angular.toJson(checkedItems);
        //console.log("Sending ==> " + cardString);

        $http({
          method: method,
          url: 'http://127.0.0.1:3000/cards',
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            "card_data": checkedItems
          }
        }).then(successCb), errCb;
      };

      $scope.removeChecked = function() {
        $scope.cardTree.forEach(function(sublist, index, array) {
          for (var i = (sublist.items.length - 1); i >= 0; i--) {
            var element = sublist.items[i];
            if (element.checked) {
              //console.log("To remove " + i);
              sublist.items.splice(i, 1);
            }
          }
        });
      };


      $scope.deleteChecked = function() {
        processChecked('DELETE', function(data) {
          // Success
          // Remove each of the items from their respective lists
          $scope.removeChecked();
          alert("Delete Successful");
        }, function(data, status, headers, config) {
          alert("Delete failed with status: " + status);

        });
      };
      $scope.enterChecked = function() {
        processChecked('POST', function(data) {
          // Success
          // Remove each of the items from their respective lists
          $scope.removeChecked();
          alert("Data enterred into Database!");
        }, function(data, status, headers, config) {
          alert("DB entry failed with status: " + status);

        });
      };

      var addDelCheckedArray = function(nodeData) {
        if (nodeData.checked) {
          // Add to list of checked items

          $scope.checkedItems.push(nodeData);
        } else {
          for (var i = 0; i < $scope.checkedItems.length; i++) {
            if ($scope.checkedItems[i] === nodeData) {
              $scope.checkedItems.splice(i, 1);
              return;
            }
          }

        }

      };

      // Callback when individual checkbox is changed
      $scope.addDelChecked = function(scope) {
        var nodeData = scope.$modelValue;
        if (scope.hasChild()) {
          // This is a folder, mirror check value on all the children
          var checked = nodeData.checked;
          addDelSublistChecks(nodeData, checked);

        } else {
          //assume model already changed from click in checkbox due to ng-model
          addDelCheckedArray(nodeData);
        }
      };

      var addDelSublistChecks = function(sublist, checked) {
        sublist.items.forEach(function(element, index2, array2) {
          if (element.checked != checked) {
            element.checked = checked;
            addDelCheckedArray(element);
          }
        });

      };

      $scope.setAllChecks = function(checked) {
        $scope.cardTree.forEach(function(sublist, index, array) {
          sublist.checked = checked;
          addDelSublistChecks(sublist, checked);
        });

      };


      $scope.showJSONstuff = function() {
        $scope.showJSON = true;
      };
      $scope.doneJSON = function() {
        $scope.showJSON = false;
      };
      $scope.commitChanges = function() {
        var c2String = angular.toJson($scope.cardTree)
        localStorage.setItem("cardTree", c2String);
        alert("Card Data saved to Local Storage");

      };
      $scope.flushLocal = function() {
        if (confirm("Are you really really sure you want to delete local storage?")) {
          localStorage.removeItem("cardTree");
          alert("Local Storage Deleted!");
        }
      };
      $scope.showSelstuff = function() {
        $scope.showSel = true;
      };
      $scope.doneSel = function() {
        $scope.showSel = false;
      };

      $scope.getNewCards = function() {
        if (confirm("Are you sure you want to delete local storage working data?  Must be done prior to getting new cards.")) {
          localStorage.removeItem("cardTree");
          $scope.updateDate = new Date();
//          var dt = new Date();
//          var todayStr = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
//          var updateDate = prompt ("Load cards created modified after what date (mm/dd/yy)", todayStr);

          var modalInstance = $uibModal.open({
              templateUrl: 'carddirModal.html',
              controller: 'carddirModalCtrl',
              size: 'sm',
              resolve: {
                updateDt: function () {
                  console.log("resolving updateDt");
                  return $scope.updateDate;
                }
              }
           });

          modalInstance.result.then(function (selectedDate) {
            $scope.updateDate = selectedDate;
            // Could do some validations here
            //alert("Want cards after " + $scope.updateDate);
            $http({
              method: 'GET',
              url: '/api/newCards',
              params : {
                directory: "x:\\cards",
                lastDate: selectedDate
              }
            }).then(function successCallback(response) {
                treeCtlScope.cardTree = [];
                cardTreeFromJson(response.data);

            }, function errorCallback(response) {
                        alert("Request for New Cards data yielded error: " + response.data + " (" + response.status + ")");
            });

          });

        }

      };

    }]); // end controller
})();
