'use strict';

(function() {
  class LibraryComponent {
    constructor($http, $state, $scope, Category, Document, Publisher, LibraryService) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.Document = Document;
        this.Category = Category;
        this.Publisher = Publisher;
        this.LibraryService = LibraryService;

        this.selectedId = 0;
        this.docsByCat = {};
        this.accordionStatus = [];
        this.selectedIndex = -1;



        // define all functions
        function findDocFromId(id, ctrl) {
          for (var i = 0; i < ctrl.documentList.length; i++) {
            var doc = ctrl.documentList[i];
            if (doc.id === id) {
              return doc;
            }
          }
          return null;
        }

        function sortListByTitle(list) {
          return list.sort(function(a, b) {
            //console.log("Looking at " + a.title + "\n    vice\n    " + b.title);
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
              return -1;
            }
            return 1;
          });

        }

        function saveConfig(ctrl) {
          var storeString = angular.toJson(ctrl.config);
          localStorage.setItem("docMgrConfig", storeString);
        }

        this.findDocIndexFromList = function(list, id) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
              return i;
            }
          }
          return -1;
        };

        this.spliceDocFromList = function(list, id) {
          var docIndex = this.findDocIndexFromList(list, id);
          if (docIndex > 0) {
            list.splice(docIndex, 1);
          } else {
            console.log("library.spliceDocFromList: document " + id + " not found in list!")
          }
        };
        this.clearStars = function() {
          this.config.starredHash = {};
          if (this.config.starredIds) {
            delete this.config.starredIds
          }
          saveConfig(this);
        };

        this.toggleStarred = function() {
          var id = this.selectedId;
          // Not using toValue, potential to get out of synch
          if (this.config.starredHash[id]) {
            delete this.config.starredHash[id];
            this.spliceDocFromList(this.starredDocs, id)
          } else {
            this.config.starredHash[id] = true;
            var document = findDocFromId(id, this);
            if (document) {
              this.starredDocs.push(document);
              this.starredDocs = sortListByTitle(this.starredDocs);
            }
          }
          saveConfig(this);
        };
        this.starredIcon = function() {
          // id == 0 indicates nothing selected
          if (this.selectedId) {
            if (this.config.starredHash[this.selectedId]) {
              return 'glyphicon glyphicon-star';
            } else {
              return 'glyphicon glyphicon-star-empty';
            }
          }
          return ''; // Return empty class for no icon
        };

        this.changeCategory = function(old, chg, document) {
          console.log("Category on document " + document.id + " changed from " + old + " to " + chg);
          this.spliceDocFromList(this.docsByCat[old], document.id);
          this.docsByCat[chg].push(document);
          this.docsByCat[chg] = sortListByTitle(this.docsByCat[chg]);
        };

        this.onSave = function() {
          alert("Selected document saved!");
        };

        this.onDelete = function(document) {
          alert("Selected document deleted!");
          // delete document reference out of all pertinent lists
          this.spliceDocFromList(this.docsByCat[document.category_id], document.id);
          this.spliceDocFromList(this.documentList, document.id);
          //   this.spliceDocFromList(this.starredDocs, document.id);
          this.$state.go("library.default");
        };
        this.getAndOrganizeDocuments = function() {
          var ctrl = this;
          this.documentList = this.Document.query(function() {
            var docMap = {};
            ctrl.starredDocs = [];
            angular.forEach(ctrl.documentList, function(doc) {
              delete doc.tag_id;
              docMap[doc.id] = doc;

              // Build starred documents list
              if (doc.id) {
                if (ctrl.config.starredHash[doc.id]) {
                  ctrl.starredDocs.push(doc);
                }
              }


              // Index by category
              var myCat = doc.category_id;
              //console.log("Putting " + doc.title + " into category " + myCat);
              if (ctrl.docsByCat[myCat]) {
                // Add docs to it
                ctrl.docsByCat[myCat].push(doc);
              } else {
                // Create the category
                ctrl.docsByCat[myCat] = [doc];

                // Flags for if accordion is open
                ctrl.accordionStatus.push(false);
              }
            });
            // Initialize the document map in LibraryService
            ctrl.LibraryService.docMapInit(docMap);

            // Sort the Docs in each category
            angular.forEach(ctrl.docsByCat, function(docs, catId, obj) {
              obj[catId] = sortListByTitle(docs);
            });
            ctrl.starredDocs = sortListByTitle(ctrl.starredDocs);
          });
        };
        // May not need this.  Could put SREF in app navbar
        this.editPubs = function() {
          console.log("Going to edit publishrs");
          this.$state.go('library.pubdisp');
        };

        this.newDoc = function(catid) {
          console.log("In library.newDoc...");
          var myCatId = (catid) ? catid : 10; //'Uncategorized';

          var myDoc = {
            id: null, // What the server would expect on save for create.
            title: "New Book",
            author: null,
            // publisher: null,    // May need this
            image_url: "http://localhost:3000/assets/document.gif",
            type_id: 1,
            category_id: myCatId
          };
          this.documentList.push(myDoc);
          this.docsByCat[myCatId].push(myDoc);
          this.$state.go('library.docdisp', {
            document: myDoc
          });
        };

        this.setServerDir = function() {
          var newDir = prompt("Enter Directory for Server Links: (Do Not Forget the trailing slash!)", this.config.serverPath);
          if (newDir) {
            if (newDir != this.config.serverPath) {
              this.config.serverPath = newDir;
              saveConfig(this);
            }
          }
        };

        this.docSelect = function(index, id) {
          console.log("In library.docSelect, id = " + id + ", index = " + index);
          if (id) {
            this.selectedId = id;
          }
        };

      } // end constructor

    $onInit() {
        // Configuration data
        var lconfig = localStorage.getItem("docMgrConfig");
        this.config = angular.fromJson(lconfig);
        console.log("Retrieved Config => " + JSON.stringify(this.config));
        if (this.config) {
          if (!this.config.starredHash) {
            this.config.starredHash = {};
          }
          if (!this.config.serverPath) {
            this.config.serverPath = "/ebooks/"; // work
            // this.config.serverPath = "http://nasd???/Multimedia/techbooks/";  // home
          }
        } else {
          alert("No configuration in local storage");
          this.config = {
            starredHash: {},
            serverPath: "/ebooks/"
          };
        }

        var ctrl = this;
        this.categories = this.Category.query(null, function() {
          ctrl.LibraryService.catMapInit(ctrl.categories);
        });
        this.getAndOrganizeDocuments();


      } // end onInit
  } // end component class

  angular.module('myappApp')
    .component('libraryComponent', {
      templateUrl: 'app/library/library.html',
      controller: LibraryComponent
    });

})();
