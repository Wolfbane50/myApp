'use strict';

(function() {
  class LoadstageComponent {
    constructor($http, $state, $scope, $window, Document, LibraryService) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.$window = $window;
        this.Document = Document;
        this.LibraryService = LibraryService;
        this.selectedIndex = -1;
        this.storageDir =" C:/Users/Daniel/myapp/server/api/books/test_dest_dir";

        this.stageDir = "C:/Users/Daniel/myapp/server/api/books/test_stage_dir";
        this.doclistOptions = {
          showDelete: true
        };
        this.stageDocStatuses = [];
        // define all functions
        function indexFromDoc(doument, ctrl) {

          for (var i = 0; i < ctrl.stageDocs.length; i++) {

            var doc = ctrl.stageDocs[i];
            if (doc === document) {
              // if (doc.title === document.title)
              return i;
            }
            return -1;
          }
        }

        this.showStorage =  function(file) {
          var dirOnly = file.replace(0, file.lastIndexOf('/'));
          console.log("Changing " + file + " to " + dirOnly);
          return dirOnly;
        }

        this.fileChange = function(ele) {
          alert("In fileChange...");
          var files = ele.files;
        };

        this.setSaved = function() {
          console.log("Got to setSaved");
          if (this.selectedIndex >= 0) {
            console.log("Setting saved");
            this.stageDocStatuses[this.selectedIndex].saved = true;
          }
        }

        this.isSelectedSaved = function() {
          var saved = false;
          if (this.selectedIndex >= 0) {
            saved = this.stageDocStatuses[this.selectedIndex].saved;
          }
          return saved;
        };
        this.isSelectedStaged = function() {
          var staged = false;
          if (this.selectedIndex >= 0) {
            staged = this.stageDocStatuses[this.selectedIndex].staged;
          }
          return staged;
        };

        this.docSelected = function(index) {
          this.selectedIndex = index;
          //console.log("Selected " + index + ", statuses => " + JSON.stringify(this.stageDocStatuses));
        };

        this.nextItem = function() {
          if(this.selectedIndex >= 0) {
            if(this.selectedIndex === (this.stageDocs.length - 1)) {
              this.selectedIndex = 0;
            } else {
              this.selectedIndex = this.selectedIndex + 1;
            }
          }
        };

        this.prevItem = function() {
          if(this.selectedIndex >= 0) {
            if(this.selectedIndex === 0) {
              this.selectedIndex = this.stageDocs.length - 1;
            } else {
              this.selectedIndex = this.selectedIndex - 1;
            }
          }
        };

        this.stageCurrent = function() {
          var currentDoc = this.stageDocs[this.selectedIndex];
          this.stageOneDocument(currentDoc);
        };

        this.stageOneDocument = function(document) {
          var ctrl = this;
          this.$http({
            method: 'POST',
            url: '/api/books/movestage',
            data: {
              target: this.storageDir,
              document: document,
              stage_directory: this.stageDir
            },
            headers: {
              'Accept': 'application/json'
            }
          }).then(function successCallback(response) {
            // alert("Got staged docs");
            //console.log("Received data: " + JSON.stringify(response.data));
            ctrl.stageResults = response.data;
            var index = indexFromDoc(document, ctrl);
            if (index >= 0) {
              ctrl.stageDocStatuses[index].staged = true;

            }
            ctrl.selectedIndex = -1;
            // How to turn off selection in documentList
            ctrl.$state.go('loadstage.displayResults', {
              result: ctrl.stageResults
            });
          }, function errorCallback(response) {
            alert("Request for Staged Doc yielded error: " + response.status +
              ": " + response.data);
          });

        };
        this.documentSaved = function(document) {
          console.log("Document saved => " + JSON.stringify(document));
          //var index = indexFromDoc(document, this);
          var index = this.selectedIndex;
          if (index >= 0) {
            alert("Doc has been saved, index = " + index);
            this.stageDocStatuses[index].saved = true;
            if (!this.stageDocStatuses[index].staged) {
              if (this.$window.confirm(document.title + ":\n\n Document was saved.  Do you want to move from stage now?")) {
                this.stageOneDocument(document);
              }
            }
          }
        };

        this.removeDoc = function(index) {
          var docToDel = this.stageDocs[index];
          this.stageDocs.splice(index, 1);
          this.selectedIndex = -1;
          this.$state.go('loadstage.default');
        };
        this.getStageDocs = function() {
          var saveStageDir = this.stageDir;

          // this.stageDir = prompt("Enter Staging Directory", "C:/Users/daniel.heaney/Documents/ebooks");
          this.stageDir = prompt("Enter Staging Directory", saveStageDir);

          if (this.stageDir) {
            //console.log("In getTagCloud");
            // Convert slashes if needed
            //     Assume windows file would be of format c:\blah\blah
            if (this.stageDir.match(/^\w\:\\/)) {
              this.stageDir = this.stageDir.replace(/\\/g, '/');
            }
            var ctrl = this;
            this.$http({
              method: 'GET',
              url: '/api/books/loadstage',
              params: {
                stage_directory: this.stageDir
              },
              headers: {
                'Accept': 'application/json'
              }
            }).then(function successCallback(response) {
              // alert("Got staged docs");
              //console.log("Received data: " + JSON.stringify(response.data));
              ctrl.stageDocs = response.data.items;
              // Set up defaults for document fields
              angular.forEach(ctrl.stageDocs, function(doc) {
                ctrl.stageDocStatuses.push({
                  saved: false,
                  staged: false
                });


                //doc.id = null; // What the server would expect on save for create.
                doc.author = null;
                // publisher: null,    // May need this
                doc.image_url = "http://localhost:3000/assets/document.gif";
                doc.category_id = 10; // Uncategorized
                doc.type_id = 1; // Book
                // URL should not have the stage path in it
                doc.url = doc.name;
                if (doc.url.indexOf(ctrl.stageDir) == 0) { // StageDir in the url
                  doc.url = doc.name.substr(ctrl.stageDir.length);
                } else {
                  doc.url = doc.name;
                }
                delete doc.name;

              });
              ctrl.selectedIndex = -1;
              ctrl.$state.go('loadstage.default');

            }, function errorCallback(response) {
              alert("Request for Staged Docs yielded error: " + response.status);
            });

          } else {
            this.stageDir = saveStageDir;
          }
        };


        this.setStorageDir = function() {
          var tmpDir = prompt("Set Storage Directory for Document Library:", this.storageDir);
          if (tmpDir) {
            this.storageDir = tmpDir;
            if (this.storageDir.match(/^\w\:\\/)) {
              this.storageDir = this.storageDir.replace(/\\/g, '/');
              //                   console.log("Transforming directory to " +  this.stageDir);
            }

          }
        };
        this.setStageDir = function() {
          var tmpDir = prompt("Set Stage Directory for Document Library:", this.stageDir);
          if (tmpDir) {
            this.stageDir = tmpDir;
            if (this.stageDir.match(/^\w\:\\/)) {
              this.stageDir = this.stageDir.replace(/\\/g, '/');
              //                   console.log("Transforming directory to " +  this.stageDir);
            }

          }
        };
        function fillStatuses(ctrl) {
          for(var i=0; i<ctrl.stageDocs.length; i++) {
            ctrl.stageDocStatuses.push({
              saved: false,
              staged: false
            });
          }
        }

        this.retrieveLocal = function() {
          var c2DataStr = localStorage.getItem("stageDocs");
          if (c2DataStr) {
            this.stageDocs = angular.fromJson(c2DataStr);
            var tmpstr = localStorage.getItem("stageDir");
            if (tmpstr) this.stageDir = tmpstr;
            tmpstr = localStorage.getItem("storageDir");
            if (tmpstr) this.storageDir = tmpstr;
            tmpstr = localStorage.getItem("stageDocStatuses");
            if (tmpstr) {
              this.stageDocStatuses = angular.fromJson(tmpstr);
            } else {
                fillStatuses(this);
            }
            this.selectedIndex = -1;
            this.$state.go('loadstage.default');
          }
        };
        this.commitChanges = function() {
          var c2String = angular.toJson(this.stageDocs);
          localStorage.setItem("stageDocs", c2String);
          localStorage.setItem("stageDir", this.stageDir);
          localStorage.setItem("storageDir", this.storageDir)
          var tmpstr = angular.toJson(this.stageDocStatuses);
          localStorage.setItem("stageDocStatuses", tmpstr);
          alert("Stage Document Data saved to Local Storage");

        };
        this.flushLocal = function() {
          if (confirm("Are you really really sure you want to delete local storage?")) {
            localStorage.removeItem("stageDocs");
            localStorage.removeItem("stageDir");
            localStorage.removeItem("storageDir");
            localStorage.removeItem("stageDocStatuses");
            alert("Local Storage Deleted!");
          }
        };
        this.backup = function() {
          var bkupData = {
            storageDir: this.storageDir,
            stageDir: this.stageDir,
            stageDocs: this.stageDocs,
            stageDocStatuses: this.stageDocStatuses
          };
          var c2String = angular.toJson(bkupData);

          this.$http({
            method: 'POST',
            url: '/api/backups/',
            data: {
              "c2_data": c2String,
              "bkfile": "loadstage_snapshot"
            }
          }).success(function(data) {
            alert("Backup Successful!\n\n" + data);
          }).error(function(data, status, headers, config) {
            // Handle the error
            alert("Backup failed with status: " + status);
          });


        };

        this.restore = function() {
          var ctrl = this;
          this.$http({
            method: 'GET',
            url: '/loadstage_snapshot.json'
          }).then(function successCallback(response) {
            ctrl.storageDir = response.data.storageDir;
            ctrl.stageDir = response.data.stageDir;
            ctrl.stageDocs = response.data.stageDocs;
            if(response.data.stageDocStatuses) {
              ctrl.stageDocStatuses = response.data.stageDocStatuses;
            } else {
              fillStatuses(ctrl);
            }
          }, function errorCallback(response) {
            alert("Request for Staged Docs yielded error: " + response.status);
          });
        };

        var validateStageDocs = function() {
          angular.forEach(this.stageDocs, function(doc) {
            if (doc.name) {
              delete doc.name;
            }
          });
          return true;
        };
        this.saveStage = function() {
          if (validateStageDocs()) {
            var ctrl = this;
            this.$http({
              method: 'POST',
              url: '/api/books/savestage',
              data: {
                target: this.storageDir,
                documents: this.stageDocs,
                stage_directory: this.stageDir
              },
              headers: {
                'Accept': 'application/json'
              }
            }).then(function successCallback(response) {
              // alert("Got staged docs");
              //console.log("Received data: " + JSON.stringify(response.data));
              ctrl.stageResults = response.data;
              ctrl.selectedIndex = -1;
              ctrl.$state.go('loadstage.displayResults', {
                result: ctrl.stageResults
              });
            }, function errorCallback(response) {
              alert("Request for Staged Docs yielded error: " + response.status +
                ": " + response.data);
            });
          }
        };
        this.showJSONstuff = function() {
             this.showJSON = true;
        };

        this.doneJSON = function() {
             this.showJSON = false;
        };


      } // end constructor

    $onInit() {
        this.stageDocs = [];
        this.$scope.$watch("storageDir", function(newValue, oldValue) {
          alert("Storagedir changed...");
        });
        this.$scope.$watch("stageDir", function(newValue, oldValue) {
          alert("Stagedir changed...");
        });


      } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('loadstageComponent', {
      templateUrl: 'app/loadstage/loadstage.html',
      controller: LoadstageComponent
    });

})();
