'use strict';

(function() {
  class LibraryComponent {
  constructor($http, $state, $scope, Category, Document, Publisher) {
    this.$http = $http;
    this.$state = $state;
    this.$scope = $scope;
    this.Document = Document;
    this.Category = Category;
    this.Publisher = Publisher;

    this.selectCount = 0;
    this.selectedId = 486;
    this.docsByCat = {};
    this.tmpDocs = [];


    // define all functions
    function saveConfig() {
      var storeString = angular.toJson(this.config);
      localStorage.setItem("docMgrConfig", storeString);
    }

    this.changeCategory = function() {
      alert("Category on selected Item changed!");
    };

    this.onSave = function() {
      alert("Selected document saved!");
    };

    this.onDelete = function() {
      alert("Selected document deleted!");
    };
    this.getAndOrganizeDocuments = function() {
      var ctrl = this;
      this.documentList = this.Document.query(function() {

        angular.forEach(ctrl.documentList, function(doc) {
          delete doc.tag_id;

          // Build starred documents list
//          if (doc.id) {
//            if (ctrl.config.starredHash[doc.id]) {
//              ctrl.starredDocs.push(doc);
//            }
//          }


          // Index by category
          var myCat = doc.category_id;
          //console.log("Putting " + doc.title + " into category " + myCat);
          if (ctrl.docsByCat[myCat]) {
            // Add docs to it
            ctrl.docsByCat[myCat].push(doc);
          } else {
            // Create the category
            ctrl.docsByCat[myCat] = [doc];
          }
        });
        // Sort the Docs in each category
        angular.forEach(ctrl.docsByCat, function(docs, catId, obj) {
          obj[catId] = docs.sort(function(a, b) {
            //console.log("Looking at " + a.title + "\n    vice\n    " + b.title);
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
              return -1;
            }
            return 1;
          });
        });
      ctrl.tmpDocs = ctrl.docsByCat[1];
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

    this.setServerDir = function () {
      var newDir = prompt("Enter Directory for Server Links: (Do Not Forget the trailing slash!)", this.config.serverPath);
      if (newDir) {
        if (newDir != this.config.serverPath) {
          this.config.serverPath = newDir;
          saveConfig();
        }
      }
    };

    this.docSelect = function(document) {
      this.selectCount++;
      console.log("In library.docSelect #" + this.selectCount);
      if (document) {
        console.log("Selected => " + JSON.stringify(document));
        this.tmpDoc = document;
      }
    };

  }  // end constructor

  $onInit() {
    // Configuration data
    var lconfig = localStorage.getItem("docMgrConfig");
    this.config = angular.fromJson(lconfig);
    console.log("Retrieved Config => " + JSON.stringify(this.config));
    if (this.config) {
      if (!this.config.starredHash) {
        this.config.starredHash = {};
      }
      if (! this.config.serverPath ) {
      this.config.serverPath = "/ebooks/"; // work
    // this.config.serverPath = "http://nasd???/Multimedia/techbooks/";  // home
      }
    } else {
      alert("No configuration in local storage");
      this.config = {
        starredHash : {},
        serverPath : "/ebooks/"
      };
    }

    this.categories = this.Category.query();
    this.publishers = this.Publisher.query();
    this.getAndOrganizeDocuments();


  } // end onInit
} // end component class

angular.module('myappApp')
  .component('libraryComponent', {
    templateUrl: 'app/library/library.html',
    controller: LibraryComponent
  });

})();
