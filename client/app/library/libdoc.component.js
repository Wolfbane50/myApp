'use strict';

(function() {
  class LibdocComponent {
  constructor($http, Category, Document, Publisher, googleBooks) {
    this.$http = $http;
    this.googleBooks = googleBooks;
    this.Category = Category;
    this.Document = Document;
    this.Publisher = Publisher;

    this.myDoc = null;
    this.docTypes = {
      'Book': 1,
      'Presentation': 2,
      'Link': 3,
      'Whitepaper': 4,
      'Schedule': 5
    };
    this.stachedDoc = {};
    this.serverPath = "";
    this.selectedType = 'other';

    // define all functions
    function getTagsForDoc(doc, ctrl) {
      // GET /docTags/:id
      ctrl.$http.get('/api/books/tagsForDoc', {
        params: {
          id: doc.id
        },
        headers: {
          'Accept': 'application/json'
        }
      }).then(function successCallback(response) {
        var tlist = response.data;
        doc.tag_list = tlist.join(', ');
        console.log("Got tag_list: " + doc.tag_list);
      }, function errorCallback(response) {
        alert("Request for tags on document yielded error(" + response.status + "): " + response.statusText);
      });
    }
    function typeOfDoc(url) {
      var extPos = url.lastIndexOf('.');
      if (extPos != -1) {
        var extension = url.substr(extPos).toLowerCase();
        //  Define Checks for each type we care about (epub, chm, etc.)
        if (extension == '.epub') {
          return 'epub';
        }
      }
      return 'other';
    }

    this.revert = function() {
      // User may select other document before call to database is complete
      //               console.log("In revert...");
      angular.copy(this.stachedDoc, this.myDoc);
    };

    this.stachDoc = function() {
      angular.copy(this.myDoc, this.stachedDoc);
    };

      this.queryGoogle = function() {
        stachDoc();
        this.googleBooks.queryGoogle(this.myDoc);
      };
      this.saveDoc = function() {
        alert("Saving Document\n\n" + this.myDoc.title);

        if (this.myDoc.id) {
          this.Document.update({
            id: this.selectedItem.id
              //            }, this.selectedItem, function() {
          }, {
            document: this.myDoc
          }, function() {
            console.log("Update successful");
             this.onSave();
          }, function(error) {
            alert("Document.update returned error -> " + JSON.stringify(error));
          });
        } else {
          this.Document.create({
            document: this.myDoc
          }, function() {
            console.log("Create successful");
            this.onSave();
          }, function(error) {
            alert("Document.create returned error -> " + JSON.stringify(error));
          });
        }
      };
      this.deleteDoc = function() {
        if (confirm("Are you sure you want to delete this document?\n\n" + this.myDoc.title)) {
          var delDoc = this.myDoc;
          if (delDoc.id) {
            this.Document.delete({
              id: delDoc.id
            }, function() {
              console.log("Delete successful");
              this.onDelete();
            }, function(error) {
              alert("Document.delete returned error -> " + JSON.stringify(error));
            });
          } else {
            // No ID, so this must be a 'new' record, so skip the database delete
            console.log("Delete an item with no ID -- assuming its not in the database");
            this.onDelete();
          }
        }
      };

      this.readEpub = function(target) {
        var storeString = angular.toJson({ url: target });
        localStorage.setItem("epub2read", storeString);
        window.open("/epub/reader/");
      };

      this.processDoc = function(doc, ctrl) {
        // Stuff to be done with doc after we get it from db
        console.log("in processDoc");
        if ((doc.id) && (!doc.tag_list)) {
          getTagsForDoc(doc, ctrl);
        }

        if(doc.url) {
          ctrl.selectedType = typeOfDoc(doc.url);
        } else {
          ctrl.selectedType = 'other';
        }

      };
console.log("Finisthed constructor");
  }  // end constructor

  $onInit() {
    // Handle Options
    console.log("In onInit of libdoc");
    if(this.options) {
      if (this.options.serverPath) {
        this.serverPath = this.options.serverPath;
      }
    }

    this.categories = this.Category.query();
    this.publishers = this.Publisher.query();
    if (this.doc) {
      console.log("Working with doc");
      this.myDoc = this.doc;
      this.processDoc(this.myDoc, this);
    } else {
      if (this.id) {
        console.log("Getting doc for ID");
        var ctrl = this;
        this.myDoc = this.Document.get({
          id: this.id
        }, function() {
          console.log("got document");
           ctrl.processDoc(ctrl.myDoc, ctrl);
        });
        } else {
          console.log("No document");
          this.myDoc = null;  // not passed anything
        }
      }
  } // end onInit
} // end component class

angular.module('myappApp')
  .component('libdoc', {
    bindings: {
      // one-way input binding, e.g.,
      // <libdoc id="$parentCtrl.docid"></foo>
      // automatically bound to `docid` on the controller
      doc: '<',                // Pointer to document record
      id: '<',                // Pointer to id of document, must retrieve data
      options: '<',           // Options object
      onCategoryChange: '&',  // Callback for category change
      onSave: '&',
      onDelete: '&'
    },
    templateUrl: 'app/library/libdoc.html',
    controller: LibdocComponent
  });

})();
