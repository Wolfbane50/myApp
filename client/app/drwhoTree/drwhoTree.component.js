'use strict';

(function() {

    class drwhoTreeComponent {
      constructor($http, $scope) {
          //console.log("In bftree constructor");
          this.episodes = [];
          this.episodeListText = "";

          this.selItem = {};
          this.showShow = false;
          this.videoList = [];
          this.editMode = false;

          this.featuring = [];
          this.questionMark = "-851px -417px";
          this.selectedItem = {};

          this.options = {};
          this.format = 'MMM yyyy';

          this.popup1 = {
            opened: false
          };

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


          this.setSelectItem = function(item) {
              this.episodeListText = "";
              this.selItem = item;

              // If not already done, convert Release Date from ISO string Javascript Date object
              if (this.selItem.Released) {
                if (!angular.isDate(this.selItem.Released)) {
                  if (typeof this.selItem.Released == "string") {
                    // Convert ISO 8601 Date string representation ("1999-07-01T00:00:00.000Z") to Javascript Date Object
                    //console.log("Converting date from ISO string to object...");
                    var dtstr = this.selItem.Released.replace(/\D/g, " ");
                    var dtcomps = dtstr.split(" ");
                    dtcomps[1]--;
                    this.selItem.Released = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
                  } else {
                    alert("Unknown format for release date of " + this.selItem.name + " : " + this.selItem.Released);
                    throw ("Database format Error");

                  }
                }
              }
            };

              this.itemSelect = function(scope) {
                this.editMode = false;

                if (scope.hasChild()) {
                  this.selItem = scope.$modelValue;
                  this.showShow = false;
                  return;
                }

                // this.listIndex points to where we are in the current branch of items
                this.listIndex = scope.index();
                // this.list points to the list of items or within a tree branch
                this.list = scope.$parentNodeScope.$modelValue;
                this.showShow = true;
                this.setSelectItem(scope.$modelValue);
              };

              this.showJSONstuff = function() {
                this.showJSON = true;
              };
              this.doneJSON = function() {
                this.showJSON = false;
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
                  this.listIndex = this.list.length - 1;
                } else {
                  this.listIndex--;
                }
                this.setSelectItem(this.list.items[this.listIndex]);
              };

              this.dateOptions = {
                //dateDisabled: disabled,
                // datepickerMode : 'month',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(1963, 1, 1) // Will not be appropriate when done with videos
                  //startingDay: 1
              };


              this.open1 = function() {
                this.popup1.opened = true;
              };

              this.newEpisode = function() {
                if (this.selItem.episodes) {
                  this.selItem.episodes.push({
                    name: "",
                    fname: ""
                  });
                } else {
                  this.selItem.episodes = [{
                    name: "",
                    fname: ""
                  }];
                }
              };

              this.newDoctor = function(scope) {
                alert("New Doctor Not Implemented Yet");
              };

              this.getDescrLink = function() {
                if (this.selItem.descrUrl) {
                  return this.selItem.descrUrl
                } else {
                  return '#';
                }
              };
              this.backup = function() {
                var c2String = angular.toJson(this.videoList);

                $http({
                  method: 'POST',
                  url: '/api/backups/',
                  data: {
                    "c2_data": c2String,
                    "bkfile": "drwho_tv_tree"
                  }
                }).success(function(data) {
                  alert("Backup Successful!\n\n" + data);
                }).error(function(data, status, headers, config) {
                  // Handle the error
                  alert("Backup failed with status: " + status);
                });

              };
            } // end constructor

          $onInit() {
              this.$http.get('drwho_tv_tree.json', {
                cache: true
              }).then(response => {
                console.log("Got Dr Who video data");
                this.videoList = response.data;
              }, function errorCallback(response) {
                alert("Request for Dr Who video data yielded error: " + response.status);
              });
            } // end onInit
        } // end component class

      angular.module('myappApp')
        .component('drwhoTreeComponent', {
          templateUrl: 'app/drwhoTree/drwhoTree.html',
          controller: drwhoTreeComponent
        });

    })();