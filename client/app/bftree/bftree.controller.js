'use strict';

(function() {

  class BftreeComponent {
    constructor($http, $scope, $uibModal) {
        //console.log("In bftree constructor");
        this.$http = $http;
        this.showJSON = false;

        this.selItem = {};
        this.audioList = [];
        this.audioTree = [];
        this.selItem = {};
        this.showShow = false;
        this.epEdit = false;
        this.editMode = false;

        this.setSelectItem = function(item) {
          this.chapterListText = "";
          this.selItem = item;
          if (this.selItem.Fname) {
            this.selMethod = "1 File";
          } else {
            if ((this.selItem.Chapters) && (this.selItem.Chapters.length)) {
              this.selMethod = "Chapters";
              angular.forEach(this.selItem.Chapters, function(chapter) {
                //console.log("Adding " + chapter);
                this.chapterListText = $scope.chapterListText + chapter + "\n";
              });
            } else {
              this.selMethod = "None";
            }
          }
        };

        this.itemSelect = function(scope) {
          this.editMode = false;

          // Handle folder
          if (scope.hasChild()) {
            this.selItem = scope.$modelValue;
            this.showShow = false;
            return;
          }

          // Handle Record
          this.listIndex = scope.index();
          this.list = scope.$parentNodeScope.$modelValue;
          this.showShow = true;

          this.setSelectItem(scope.$modelValue);

        };

        this.nextItem = function() {

          if (this.listIndex == (this.list.length - 1)) {
            this.listIndex = 0;
          } else {
            this.listIndex++;
          }

          this.setSelectItem(this.list.items[this.listIndex]);
        };

        this.prevItem = function() {
          if (this.listIndex == 0) {
            this.listIndex = things.list.length - 1;
          } else {
            this.listIndex--;
          }
          this.setSelectItem(this.list.items[this.listIndex]);
        };

        this.dateOptions = {
          //dateDisabled: disabled,
          // datepickerMode : 'month',
          maxDate: new Date(2020, 5, 22),
          minDate: new Date(1990, 1, 1) // Will not be appropriate when done with videos
            //startingDay: 1
        };

        this.format = 'MMM yyyy';

        this.popup1 = {
          opened: false
        };

        this.open1 = function() {
          this.popup1.opened = true;
        };

        // Open loading modal dialog
        this.modalInstance = $uibModal.open({
          templateUrl: 'myModalContent.html'
        });

        this.selectedItemClass = function(scope) {
          var nodeData = scope.$modelValue;
          if (this.selItem == nodeData) {
            return 'dhitem-selected';
          } else {
            return 'dhitem';
          }
        };

        $scope.itemIcon = function(scope) {
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

        this.selectedItem = {};

        this.myCollapseAll = function() {
          $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        this.myExpandAll = function() {
          $scope.$broadcast('angular-ui-tree:expand-all');
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
          this.list = scope.$modelValue;
          var series = scope.$modelValue.Series;
          console.log("Adding item to " + series);
          var newRecord = {
            "Title": "Untitled",
            "Doctor": "None",
            "Series": series,
            "id": new Date()
          };

          this.list.items.push(newRecord);
          this.listIndex = this.list.items.length - 1;
          this.setSelectItem(this.list.items[this.listIndex]);
        };

        this.newSeries = function(scope) {
          var newName = prompt("Name of new Series: ");
          if (newName) {
            var len = this.audioTree.length;
              var newId = this.audioTree[len-1].id + 5000;
            this.audioTree.push({
              "Series": newName,
              "id": newId,
              "items": []
            });
          }
        };



        this.updateChapters = function() {
          // Use chapterListText to update array of chapters
          //console.log("Updating chapters");
          this.selItem.Chapters = this.chapterListText.split("\n");
        };


        this.showJSONstuff = function() {
          this.showJSON = true;
        };

        this.doneJSON = function() {
          this.showJSON = false;
        };
        this.flatten = function() {
          var flatList = [];

          angular.forEach(this.audioTree, function(element) {
            var seriesList = element.items;
            angular.forEach(seriesList, function(element) {
              flatList.push(element);
            });
          });
          return flatList;
        };
        this.backup = function() {
          var c2String = angular.toJson(this.flatten());

          $http({
            method: 'POST',
            url: '/api/backups/',
            data: {
              "c2_data": c2String,
              "bkfile": "bigFinish"
            }
          }).success(function(data) {
            alert("Backup Successful!\n\n" + data);
          }).error(function(data, status, headers, config) {
            // Handle the error
            alert("Backup failed with status: " + status);
          });

        };


      } // End of constructor

    $onInit() {
        //console.log("Requesting BF Data");
        this.$http.get('bigFinish.json', {
          cache: true
        }).then(response => {
          this.audioList = response.data;
          console.log("Got BF Data");

          var seriesIncr = 50000;
          var seriesLookup = {};
          // Walk the data and create a hierarchical list
          angular.forEach(this.audioList, function(element) {

            var series = element.Series;
            var targetList;

            //    Flag problems in file management
            //        Must have SPath if FName or Chapters exist
            var hasChapters;
            if (element.Chapters) {
              hasChapters = (element.Chapters.length > 0);
            } else {
              hasChapters = false;
            }
            if ((element.Fname) || (hasChapters)) {
              if (!element.SPath) {
                console.log("No SPath but FName or Chapters defined for " + element.Title);
                //alert("No SPath but FName or Chapters defined for " + element.Title);
                //throw("Database format Error");
              }
            } else {
              //        Should not be a Link if no Fname or Chapters
              if (element.Link) {
                console.log("Link defined but no FName or Chapters defined for " + element.Title);
              }
            }
            //    Remove Link
            if (element.Link) {
              delete element.Link;
            }

            //    Fix Release Date
            if (element.Released) {
              if (!angular.isDate(element.Released)) {
                if (typeof element.Released == "string") {
                  // Convert ISO 8601 Date string representation ("1999-07-01T00:00:00.000Z") to Javascript Date Object
                  //console.log("Converting date from ISO string to object...");
                  var dtstr = element.Released.replace(/\D/g, " ");
                  var dtcomps = dtstr.split(" ");
                  dtcomps[1]--;
                  element.Released = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
                } else {

                  if (typeof element.Released == "number") {
                    // Convert from Excel Date Format
                    //console.log("Converting date from excel format to Javascript...");
                    var utc_days = Math.floor(element.Released - 25569);
                    var utc_value = utc_days * 86400;
                  } else {
                    alert("Unknown format for release date of " + element.Title + " : " + element.Released);
                    throw ("Database format Error");
                  }
                }
              }
            }

            var series = element.Series;
            if (seriesLookup[series]) {
              targetList = seriesLookup[series];
              targetList.items.push(element);
            } else {
              targetList = {
                "Series": series,
                "id": seriesIncr++,
                "items": [element]
              };
              seriesLookup[series] = targetList;
              this.temp = "more done";

              this.audioTree.push(targetList);
            }
          }, this);

          this.modalInstance.dismiss('cancel');
        }, function errorCallback(response) {
            alert("Request for BF data yielded error: " + response.status);

        });
      } // end of $onInit

  } // end of component


  angular.module('myappApp')
    .component('bftreeComponent', {
      templateUrl: 'app/bftree/bftree.html',
      controller: BftreeComponent,
      controllerAs: 'Bftree'
    });

})();
