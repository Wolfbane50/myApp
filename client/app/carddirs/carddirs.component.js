'use strict';

(function() {
  class CarddirsComponent {
  constructor($http, $scope, $uibModal) {
    this.$http = $http;
    this.$scope = $scope;
    this.$uibModal = $uibModal;

    this.showJSON = false;
    this.showSel = false;
    //this.editDoc = {};
    this.selItem = {};
    this.cardTree = [];
    this.selItem = {};
    this.showShow = false;
    this.jsonTable = false;
    this.checkedItems = [];
    this.selectedItem = {};

    this.options = {
      "data-drag-enabled": false
    };

    this.cardTreeFromJson = function(data, ctrl) {
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
            ctrl.cardTree.push(targetList);
          }
        });
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
          docs: [],
          items: []
        });
      };


      this.itemSelect = function(scope) {
        this.selItem = scope.$modelValue;
        this.path = this.selItem['path'];
        //alert("Selected item:  " + this.selItem.path);
        if ((this.selItem.fname) && (this.selItem.name)) {
          this.name = this.selItem.name;
        } else {
          this.name = "";
        }

        if ((this.selItem.fname) && (this.selItem.brand)) {
          this.brand = this.selItem.brand;
        } else {
          this.brand = "";
          this.selItem.brand = "";
        }
        if ((this.selItem.fname) && (this.selItem.type)) {
          this.type = this.selItem.type;
        } else {
          this.type = "";
          this.selItem.type = "";
        }
        if ((this.selItem.fname) && (this.selItem.team)) {
          this.team = this.selItem.team;
        } else {
          this.team = "";
          this.selItem.team = "";
        }
      };

      this.applyFolder = function() {
        alert("Apply tags to " + this.path);
        this.cardTree.forEach(function(sublist, index, array) {
          if (sublist.path == this.path) {
            sublist.items.forEach(function(element, index2, array2) {
              if (this.selItem.team) {
                element.team = this.selItem.team;
              }
              if (this.selItem.brand) {
                element.brand = this.selItem.brand;
              }
              if (this.selItem.type) {
                element.type = this.selItem.type;
              }
              if (this.selItem.path) {
                element.path = this.selItem.path;
              }
            });
          }
        });
      };


      var processChecked = function(method, successCb, errCb) {
        var checkedItems = this.checkedItems;
        if (checkedItems.length == 0) {
          alert("Sorry!  No items were selected.");
          return;
        }

        //var cardString = angular.toJson(checkedItems);
        //console.log("Sending ==> " + cardString);

        $http({
          method: method,
          //  Why port 3000????
          url: 'http://127.0.0.1:3000/cards',
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            "card_data": checkedItems
          }
        }).then(successCb), errCb;
      };

      this.removeChecked = function() {
        this.cardTree.forEach(function(sublist, index, array) {
          for (var i = (sublist.items.length - 1); i >= 0; i--) {
            var element = sublist.items[i];
            if (element.checked) {
              //console.log("To remove " + i);
              sublist.items.splice(i, 1);
            }
          }
        });
      };


      this.deleteChecked = function() {
        processChecked('DELETE', function(data) {
          // Success
          // Remove each of the items from their respective lists
          this.removeChecked();
          alert("Delete Successful");
        }, function(data, status, headers, config) {
          alert("Delete failed with status: " + status);

        });
      };
      this.enterChecked = function() {
        processChecked('POST', function(data) {
          // Success
          // Remove each of the items from their respective lists
          this.removeChecked();
          alert("Data enterred into Database!");
        }, function(data, status, headers, config) {
          alert("DB entry failed with status: " + status);

        });
      };

      var addDelCheckedArray = function(nodeData, ctrl) {
        if (nodeData.checked) {
          // Add to list of checked items

          ctrl.checkedItems.push(nodeData);
        } else {
          for (var i = 0; i < ctrl.checkedItems.length; i++) {
            if (ctrl.checkedItems[i] === nodeData) {
              ctrl.checkedItems.splice(i, 1);
              return;
            }
          }

        }

      };

      // Callback when individual checkbox is changed
      this.addDelChecked = function(scope) {
        var nodeData = scope.$modelValue;
        if (scope.hasChild()) {
          // This is a folder, mirror check value on all the children
          var checked = nodeData.checked;
          addDelSublistChecks(nodeData, checked, this);

        } else {
          //assume model already changed from click in checkbox due to ng-model
          addDelCheckedArray(nodeData, this);
        }
      };

      var addDelSublistChecks = function(sublist, checked, ctrl) {
        sublist.items.forEach(function(element, index2, array2) {
          if (element.checked != checked) {
            element.checked = checked;
            addDelCheckedArray(element, ctrl);
          }
        });

      };

      this.setAllChecks = function(checked) {
        var ctrl = this;
        this.cardTree.forEach(function(sublist, index, array) {
          sublist.checked = checked;
          addDelSublistChecks(sublist, checked, ctrl);
        });

      };


      this.showJSONstuff = function() {
        this.showJSON = true;
      };
      this.doneJSON = function() {
        this.showJSON = false;
      };
      this.commitChanges = function() {
        var c2String = angular.toJson(this.cardTree)
        localStorage.setItem("cardTree", c2String);
        alert("Card Data saved to Local Storage");

      };
      this.flushLocal = function() {
        if (confirm("Are you really really sure you want to delete local storage?")) {
          localStorage.removeItem("cardTree");
          alert("Local Storage Deleted!");
        }
      };
      this.showSelstuff = function() {
        this.showSel = true;
      };
      this.doneSel = function() {
        this.showSel = false;
      };

      this.getNewCards = function() {
        if (confirm("Are you sure you want to delete local storage working data?  Must be done prior to getting new cards.")) {
          localStorage.removeItem("cardTree");
          this.updateDate = new Date();
//          var dt = new Date();
//          var todayStr = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
//          var updateDate = prompt ("Load cards created modified after what date (mm/dd/yy)", todayStr);
          var ctrl = this;
          var modalInstance = $uibModal.open({
              templateUrl: 'carddirModal.html',
              controller: 'carddirModalCtrl',
              size: 'sm',
              resolve: {
                updateDt: function () {
                  console.log("resolving updateDt");
                  return ctrl.updateDate;
                }
              }
           });

          modalInstance.result.then(function (selectedDate) {
            ctrl.updateDate = selectedDate;
            // Could do some validations here
            //alert("Want cards after " + this.updateDate);

            ctrl.$http.get('/api/newCards' , {
              params : {
                directory: "x:\\cards",
                lastDate: selectedDate
              }
            }).then(response => {
               ctrl.cardTree = [];
                ctrl.cardTreeFromJson(response.data, ctrl);

            }, function errorCallback(response) {
                        alert("Request for New Cards data yielded error: " + response.data + " (" + response.status + ")");
            });

          });

        }

      };

  }

  $onInit() {
    var c2DataStr = localStorage.getItem("cardTree");
    if (c2DataStr) {
      //alert("Getting data from local store");

      this.cardTree = angular.fromJson(c2DataStr);
    } else {
      var ctrl = this;
      this.$http.get('carddirs.json')
         .then(response => {
             ctrl.cardTreeFromJson(response.data, ctrl);
         }, function errorCallback(response) {
            alert("Request for New Cards data yielded error: " + response.status);
         });
    }
  }
}

angular.module('myappApp')
 .component('carddirsComponent', {
   templateUrl: 'app/carddirs/carddirs.html',
   controller: CarddirsComponent
 });


})();
