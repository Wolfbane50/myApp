'use strict';

(function() {

    angular.module('myappApp')
      .controller('drwhoTreeCtrl', ['$scope', '$http', function($scope, $http) {


          $scope.episodes = [];
          $scope.selItem = {};
          $scope.showShow = false;
          $scope.videoList = [];
          $scope.editMode = false;

          $scope.featuring = [];
          $scope.questionMark = "-851px -417px";

          var treeCtlScope = $scope;

          $http.get('drwho_tv_tree.json', {
            cache: true
          }).then(response => {
            console.log("Got Dr Who video data");
            treeCtlScope.videoList = response.data;
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


          $scope.setSelectItem = function(item) {
            $scope.episodeListText = "";
            $scope.selItem = item;

            // If not already done, convert Release Date from ISO string Javascript Date object
            if ($scope.selItem.Released) {
              if (! angular.isDate($scope.selItem.Released)) {
                if (typeof $scope.selItem.Released == "string") {
                   // Convert ISO 8601 Date string representation ("1999-07-01T00:00:00.000Z") to Javascript Date Object
                   //console.log("Converting date from ISO string to object...");
                   var dtstr = $scope.selItem.Released.replace(/\D/g," ");
                   var dtcomps = dtstr.split(" ");
                   dtcomps[1]--;
                   $scope.selItem.Released = new Date(Date.UTC(dtcomps[0],dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
                } else {
                  alert("Unknown format for release date of " + $scope.selItem.name + " : " + $scope.selItem.Released);
                  throw("Database format Error");

                }
              }
            }
            if (($scope.selItem.episodes) && ($scope.selItem.episodes.length)) {
              angular.forEach(this.selItem.episodes, function(ep) {
                  // NOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!
                  // Should be able to template this
                  $scope.episodeListText = $scope.episodeListText + ep.name + "\n";
                });
              }
            };

            $scope.itemSelect = function(scope) {
              $scope.editMode = false;

              if (scope.hasChild()) {
                $scope.selItem = scope.$modelValue;
                $scope.showShow = false;
                return;
              }

              // $scope.listIndex points to where we are in the current branch of items
              $scope.listIndex = scope.index();
              // $scope.list points to the list of items or within a tree branch
              $scope.list = scope.$parentNodeScope.$modelValue;
              $scope.showShow = true;
              $scope.setSelectItem(scope.$modelValue);
            };

            $scope.showJSONstuff = function() {
              $scope.showJSON = true;
            };
            $scope.doneJSON = function() {
              $scope.showJSON = false;
            };

            $scope.nextItem = function() {

              if ($scope.listIndex == ($scope.list.length - 1)) {
                $scope.listIndex = 0;
              } else {
                $scope.listIndex++;
              }

              $scope.setSelectItem($scope.list.items[$scope.listIndex]);
            };

            $scope.prevItem = function() {
              if ($scope.listIndex == 0) {
                $scope.listIndex = $scope.list.length - 1;
              } else {
                $scope.listIndex--;
              }
              $scope.setSelectItem($scope.list.items[$scope.listIndex]);
            };

            $scope.dateOptions = {
               //dateDisabled: disabled,
              // datepickerMode : 'month',
               maxDate: new Date(2020, 5, 22),
               minDate: new Date(1963, 1, 1)  // Will not be appropriate when done with videos
               //startingDay: 1
             };

             $scope.format = 'MMM yyyy';

             $scope.popup1 = {
               opened: false
             };

             $scope.open1 = function() {
               $scope.popup1.opened = true;
             };

             $scope.newEpisode = function() {
               if ($scope.selItem.episodes) {
                 $scope.selItem.episodes.push({
                   name: "",
                   fname: ""
                 });
               } else {
                 $scope.selItem.episodes = [ {
                   name: "",
                   fname: ""
                 } ];
               }
             }

            $scope.newDoctor = function(scope) {
                alert("New Doctor Not Implemented Yet");
            };

            $scope.getDescrLink = function() {
              if ($scope.selItem.descrUrl) {
                return $scope.selItem.descrUrl
              } else {
                return '#';
              }
            }
            $scope.backup = function() {
                     var c2String = angular.toJson($scope.videoList);

                      $http({ method: 'POST', url: '/api/backups/',
                         data: { "c2_data" : c2String,
                                 "bkfile" : "drwho_tv_tree"
                       } }).success(function(data) {
                           alert("Backup Successful!\n\n" + data);
                      }).error(function(data, status, headers, config) {
                        // Handle the error
                           alert("Backup failed with status: " + status);
                      });

             };


          }]); // end controller
      })();
