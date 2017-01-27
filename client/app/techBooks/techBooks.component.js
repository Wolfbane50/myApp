'use strict';

(function() {
  class TechBooksComponent {
  constructor($http, $scope, $state, Category, Document, Publisher, googleBooks) {
    this.$http = $http;
    this.$scope = $scope;
    this.$state = $state;
    this.Category = Category;
    this.Document = Document;
    this.Publisher = Publisher;
    this.queryGoogle = googleBooks.queryGoogle;

    this.docsByCat = {};
    this.docsByTag = {};
    this.tagList = [];
    this.selectedItem;
    this.dbDocument = {};
    this.editCategories = false;
    this.starredDocs = [];
    this.selectedType = 'other';
    this.docTypes = {
      'Book': 1,
      'Presentation': 2,
      'Link': 3,
      'Whitepaper': 4,
      'Schedule': 5
    };


    // define all functions
    function saveConfig() {
      var storeString = angular.toJson(this.config);
      localStorage.setItem("docMgrConfig", storeString);
    }

    function catNameFromIndex(idx) {
      for (var i = 0; i < this.cateories.length; i++) {
        cat = this.categories[i];
        if (cat.id == idx) {
          return cat.name;
        }
      }
      return null;
    }

    function getTagsForDoc(doc) {
      // GET /docTags/:id
      this.$http.get('/api/books/tagsForDoc', {
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
    function findDocIndexFromCatList(catid, id) {
      var catlist = this.docsByCat[catid];
      for (var i = 0; i < catlist.length; i++) {
        if (catlist[i].id == id) {
          return i;
        }
      }
      return null;
    }


    this.clearStars = function() {
      this.config.starredHash = {};
      if (this.config.starredIds) {
        delete this.config.starredIds
      }
      saveConfig();
    };

    // Seems a little redundant, except capturing return
    //     Really needs to move into categories controller/component
    this.getCategories = function() {
      //console.log("In getCategories");
      this.categories = Category.query(function() {
        console.log('Got categories');
        //console.log(JSON.stringify(this.categories));
      });
      return this.categories;
    };

    // Publishers is simply a pick-list in JSON file
    //     User does not have to use a value from the list
    //     Could be wrapped as a resource, but not now
    //     Add to picklist by editing server/public/publishers.json
    this.getPublishers = function() {
      //console.log("Will query publishers");
      var myPublishers = this.publishers = [];
      this.$http({
        method: 'GET',
        url: '/publishers.json'
      }).then(function successCallback(response) {
        var publisherRec = response.data;
        console.log("Got publishers");
        angular.forEach(publisherRec.items, function(item) {
          myPublishers.push(item.name);
        });
      }, function errorCallback(response) {
        alert("Request for Publishers data yielded error: " + response.status);

        myPublishers = [
          "O\'Reilly",
          'APress',
          'Manning',
          'McGraw Hill',
          'MS Press',
          'No Starch',
          'Packt',
          'Peachpit Press',
          'Prentice Hall',
          'Pragmatic Publishing',
          'Sams',
          '7 Summits',
          'Wrox',
          'Addison Wesley'
        ];
      });
    };

    this.getDocsByCategory = function(cat) {
      //console.log("In getDocsByCategory");
      //console.log("Looking for cat = " + cat);
      if (this.docsByCat[cat]) {
        var docArray = this.docsByCat[cat];
        //console.log("Found " + docArray.length  + " documents");
        //  for (var i=0; i<docArray.length; i++) {
        //    console.log("      " + docArray[i].title);
        //    }
        return docArray;
      } else {
        //console.log("Returning empty...");

        return [];
      }
    };

    this.getAndOrganizeDocuments = function() {
      console.log("In getAndOrganizeDocuments");
      var ctrl = this;
      this.documentList = Document.query(function() {

        angular.forEach(ctrl.documentList, function(doc) {
          delete doc.tag_id;

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
    this.setServerDir = function () {
      var newDir = prompt("Enter Directory for Server Links: (Do Not Forget the trailing slash!)", this.config.serverPath);
      if (newDir) {
        if (newDir != this.config.serverPath) {
          this.config.serverPath = newDir;
          saveConfig();
        }
      }
    };

    this.newDoc = function(catid) {
      console.log("In techBooks newDoc...");
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
      this.$state.go('techBooks.document', {
        doc: myDoc
      });
    };

    this.revert = function() {
      // User may select other document before call to database is complete
      console.log("In revert...");
      var revertDoc = this.selectedItem;

      // This doesn't work if the doc is not in the database (ie id=null)
      if (revertDoc.id) {
        var revertedDoc = Document.get({
          id: revertDoc.id
        }, function() {
          // Deepcopy over local copy from database
          angular.copy(revertedDoc, revertDoc);
          //alert("Document Updated");
        });
      }
    };
    this.itemSelect = function(doc) {
      this.selectedItem = doc;
      // Problem child - Categories are not consecutive
      for (var i=0; i<this.categories.length; i++) {
        if (doc.category_id == this.categories[i].id) {
          this.selectedCategory = this.categories[i];
        }
      }

      if ((doc.id) && (!doc.tag_list)) {
        getTagsForDoc(doc);
      }

      if(doc.url) {
        this.selectedType = typeOfDoc(doc.url);
      } else {
        this.selectedType = 'other';
      }
      //  this.dbDocument = Document.get({
      //    id: doc.id
      //  });
    };

    this.typeChange = function() {
      console.log("In typeChange");
    };

    this.changeCategory = function() {
      //console.log("In changeCategory");
      var oldCat = this.selectedItem.category_id;
      this.selectedItem.category_id = this.selectedCategory.id;

      //  Need to move document from one category list to the other
      //console.log("Calling function with " + this.selectedCategory.id + " and " + this.selectedItem.id);
      var catListIndex = findDocIndexFromCatList(oldCat, this.selectedItem.id);
      //console.log("Need to delete item " + catListIndex);
      this.docsByCat[oldCat].splice(catListIndex, 1);
      this.docsByCat[this.selectedCategory.id].push(this.selectedItem);

    };

    this.findDocIndexFromList = function(id) {
      for (var i = 0; i < this.documentList.length; i++) {
        if (this.documentList[i].id == id) {
          return i;
        }
      }
      return null;
    };
    this.findDocFromList = function(id) {
      for (var i = 0; i < this.documentList.length; i++) {
        if (this.documentList[i].id == id) {
          return this.documentList[i];
        }
      }
      return null;
    };
    this.deleteDoc = function() {
      function cleanup(delDoc) {
        this.docsByCat[delDoc.category_id].splice(findDocIndexFromCatList(delDoc.category_id, delDoc.id), 1);
        this.documentList.splice(this.findDocIndexFromList(delDoc.id), 1);
        this.selectedItem = null;
        this.$state.go('techBooks.default');

      }
      if (confirm("Are you sure you want to delete this document?\n\n" + this.selectedItem.title)) {
        var delDoc = this.selectedItem;
        if (delDoc.id) {
          Document.delete({
            id: delDoc.id
          }, function() {
            console.log("Delete successful");
            cleanup(delDoc);
          }, function(error) {
            alert("Document.delete returned error -> " + JSON.stringify(error));
          });
        } else {
          // No ID, so this must be a 'new' record, so skip the database delete
          console.log("Delete an item with no ID -- assuming its not in the database");
          cleanup(delDoc);
        }
      }

    };

    this.saveDoc = function() {
      alert("Saving Document\n\n" + this.selectedItem.title);

      if (this.selectedItem.id) {
        Document.update({
          id: this.selectedItem.id
            //            }, this.selectedItem, function() {
        }, {
          document: this.selectedItem
        }, function() {
          console.log("Update successful");
          // Write Message to Toast
        }, function(error) {
          alert("Document.update returned error -> " + JSON.stringify(error));
        });
      } else {
        Document.create({
          document: this.selectedItem
        }, function() {
          console.log("Create successful");
          // Update ID  !!!  May need to add interceptor on response to resource post request

          // Write Message to Toast
        }, function(error) {
          alert("Document.create returned error -> " + JSON.stringify(error));
        });
      }
    }

    this.toggleStarred = function() {
      if (this.config.starredHash[this.selectedItem.id]) {
        delete this.config.starredHash[this.selectedItem.id];
        for (var i = 0; i < this.starredDocs.length; i++) {
          if (this.starredDocs[i] === this.selectedItem) {
            this.starredDocs.splice(i, 1); // Delete out of array
            break;
          }
        }
      } else {
        this.config.starredHash[this.selectedItem.id] = true;
        this.starredDocs.push(this.selectedItem);
      }
      saveConfig();
    };

    this.starredIcon = function() {
      if (this.selectedItem) {
        if (this.selectedItem.id) {
          if (this.config.starredHash[this.selectedItem.id]) {
//                console.log("Returning filled star");
            return 'glyphicon glyphicon-star';
          } else {
//                console.log("ID not found in hash");
          }
        } else {
//              console.log("No ID ....");
        }
      }
//          console.log("Returning empty star");
      return 'glyphicon glyphicon-star-empty';

    };

    this.readEpub = function(target) {
      var storeString = angular.toJson({ url: target });
      localStorage.setItem("epub2read", storeString);
      window.open("/epub/reader/");
    };

    this.booksHome = function() {
        this.$state.go('techBooks.default');
    };

  }  // end constructor

  $onInit() {
    //this.$http.get(<url>)
    //   .then(response => {
    //       this.<whatever> = response.data;
    //   }, function errorCallback(response) {
    //      alert("Request for <something> data yielded error: " + response.status);
    //   });
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
        this.getCategories();
        this.getPublishers();
        this.getAndOrganizeDocuments();
        this.$state.go('techBooks.default');

  } // end onInit
} // end component class

angular.module('myappApp')
  .component('techBooksComponent', {
    templateUrl: 'app/techBooks/techBooks.html',
    controller: TechBooksComponent
  });

})();
