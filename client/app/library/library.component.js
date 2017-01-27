'use strict';

(function() {
  class LibraryComponent {
  constructor($http, $scope, Category, Document, Publisher) {
    this.$http = $http;
    this.$scope = $scope;
    this.Document = Document;
//    this.Category = Category;
//    this.Publisher = Publisher;

    this.selectedId = 486;
    this.docsByCat = {};
    this.tmpDocs = [];


    // define all functions
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
      console.log("In getAndOrganizeDocuments");
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
      });
    };

  }  // end constructor

  $onInit() {
    this.categories = this.Category.query();
    this.publishers = this.Publisher.query();
    this.getAndOrganizeDocuments();
    this.tmpDocs = docsByCat[1];

  } // end onInit
} // end component class

angular.module('myappApp')
  .component('libraryComponent', {
    templateUrl: 'app/library/library.html',
    controller: LibraryComponent
  });

})();
