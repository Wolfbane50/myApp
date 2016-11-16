'use strict';

(function() {

  angular.module('myappApp')
    .controller('techBooksCtrl', ['$scope', '$http', '$state', 'Category', 'Document', 'Publisher',
      function($scope, $http, $state, Category, Document, Publisher) {

        // Configuration data
        var lconfig = localStorage.getItem("docMgrConfig");
        $scope.config = angular.fromJson(lconfig);
        console.log("Retrieved Config => " + JSON.stringify($scope.config));
        if ($scope.config) {
          if (!$scope.config.starredHash) {
            $scope.config.starredHash = {};
          }
          if (! $scope.config.serverPath ) {
          $scope.config.serverPath = "/ebooks/"; // work
        // $scope.config.serverPath = "http://nasd???/Multimedia/techbooks/";  // home

          }
        } else {
          alert("No configuration in local storage");
          $scope.config = {
            starredHash : {},
            serverPath : "/ebooks/"
          };
        }

        $scope.clearStars = function() {
          $scope.config.starredHash = {};
          if ($scope.config.starredIds) {
            delete $scope.config.starredIds
          }
          saveConfig();
          }

        ////////////////////////////////////////////
        // API to docmgr (RoR implementation)
        ////////////////////////////////////////////
        //
        //      resources :posts  - Is this really used ???
        //      resources :categories
        //      resources :documents
        //
        //      get "documents/tag_cloud"  - Returns HTML for a tag cloud
        //              Link to navigate_tag(tag.name)
        //      get "documents/tagged"        - Returns HTML for list of documents with a given tag
        //              Link to javascript:navigate_function(doc.id)

        //      get "loadstage/index"
        //      get "loadstage/getfiles"
        //      get "loadstage/getfilelists"
        //      get "loadstage/process_dir"

        //      get "catalog/edit"
        //      get "catalog/index"
        //      get "catalog/message"
        //      get "catalog/genlocal"
        //      post "catalog/genlocal"




        $scope.getCategories = function() {
          //console.log("In getCategories");
          $scope.categories = Category.query(function() {
            console.log('Got categories');
            //console.log(JSON.stringify($scope.categories));
          });
          //        $http({
          //           method: 'GET',
          //           url: 'http://localhost:3000/categories/',
          //           headers: {
          //             'Accept': 'application/json'
          //           }
          //         }).then(function successCallback(response) {
          //           $scope.categories = response.data;
          //           //console.log("--Categories--" + JSON.stringify(response.data) );
          //
          //         }, function errorCallback(response) {
          //           alert("Request for Categories data yielded error: " + response.status);
          //         });
          return $scope.categories;

        };

        console.log("Will query publishers");
        $scope.publishers = [];
        $http({
          method: 'GET',
          url: '/publishers.json'
        }).then(function successCallback(response) {
          var publisherRec = response.data;
          console.log("Got publishers");
          angular.forEach(publisherRec.items, function(item) {
            $scope.publishers.push(item.name);
          });
        }, function errorCallback(response) {
          alert("Request for Publishers data yielded error: " + response.status);

          $scope.publishers = [
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

        $scope.docTypes = {
          'Book': 1,
          'Presentation': 2,
          'Link': 3,
          'Whitepaper': 4,
          'Schedule': 5
        };
        $scope.getCategories();

        $scope.docsByCat = {};
        $scope.docsByTag = {};
        $scope.tagList = [];
        $scope.selectedItem;
        $scope.dbDocument = {};
        $scope.editCategories = false;
        $scope.starredDocs = [];
        $scope.selectedType = 'other';

        function saveConfig() {
          var storeString = angular.toJson($scope.config);
          localStorage.setItem("docMgrConfig", storeString);

        }

        $scope.getDocsByCategory = function(cat) {
          //console.log("In getDocsByCategory");
          //console.log("Looking for cat = " + cat);
          if ($scope.docsByCat[cat]) {
            var docArray = $scope.docsByCat[cat];
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

        $scope.getAndOrganizeDocuments = function() {
          console.log("In getAndOrganizeDocuments");
          $scope.documentList = Document.query(function() {

            angular.forEach($scope.documentList, function(doc) {
              delete doc.tag_id;

              // Build starred documents list
              if (doc.id) {
                if ($scope.config.starredHash[doc.id]) {
                  $scope.starredDocs.push(doc);
                }
              }


              // Index by category
              var myCat = doc.category_id;
              //console.log("Putting " + doc.title + " into category " + myCat);
              if ($scope.docsByCat[myCat]) {
                // Add docs to it
                $scope.docsByCat[myCat].push(doc);
              } else {
                // Create the category
                $scope.docsByCat[myCat] = [doc];
              }
            });
            // Sort the Docs in each category
            angular.forEach($scope.docsByCat, function(docs, catId, obj) {
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
        $scope.setServerDir = function () {
          var newDir = prompt("Enter Directory for Server Links: (Do Not Forget the trailing slash!)", $scope.config.serverPath);
          if (newDir) {
            if (newDir != $scope.config.serverPath) {
              $scope.config.serverPath = newDir;
              saveConfig();
            }
          }
        }

        $scope.getAndOrganizeDocuments();
        $state.go('techBooks.default');


        $scope.newDoc = function(catid) {
          console.log("In techBooks newDoc...");
          var myCatId = (catid) ? catid : 10; //'Uncategorized';

          //var myDoc = Document.new();
          // Server just returns empty record - No IDs, so no point calling it
          //$http({
          //  method: 'GET',
          //  url: 'http://localhost:3000/documents/new',
          //  headers: {
          //              'Accept': 'application/json'
          //     }
          //  }).then(function successCallback(response) {
          //       console.log("Got new item from server... " + JSON.stringify(response.data));
          //
          //         $scope.itemSelect($scope.documentList.push(response.data));
          //          // Add to the list and Select it
          //          // So, this doesnt add it to the categories or the list on the side.
          //  }, function errorCallback(response) {
          //            alert("Request for Document data yielded error: " + response.status);
          //  });
          var myDoc = {
            id: null, // What the server would expect on save for create.
            title: "New Book",
            author: null,
            // publisher: null,    // May need this
            image_url: "http://localhost:3000/assets/document.gif",
            type_id: 1,
            category_id: myCatId
          };
          $scope.documentList.push(myDoc);
          $scope.docsByCat[myCatId].push(myDoc);
          $state.go('techBooks.document', {
            doc: myDoc
          });
          //$scope.itemSelect(myDoc);
        };

        $scope.revert = function() {
          // User may select other document before call to database is complete
          console.log("In revert...");
          var revertDoc = $scope.selectedItem;

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

        function catNameFromIndex(idx) {
          for (var i = 0; i < $scope.cateories.length; i++) {
            cat = $scope.categories[i];
            if (cat.id == idx) {
              return cat.name;
            }
          }
          return null;
        }

        function getTagsForDoc(doc) {
          // GET /docTags/:id
          $http({
            method: 'GET',
            url: '/api/books/tagsForDoc',
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

        $scope.itemSelect = function(doc) {
          $scope.selectedItem = doc;
          // Problem child - Categories are not consecutive
          for (var i=0; i<$scope.categories.length; i++) {
            if (doc.category_id == $scope.categories[i].id) {
              $scope.selectedCategory = $scope.categories[i];
            }
          }

          if ((doc.id) && (!doc.tag_list)) {
            getTagsForDoc(doc);
          }

          if(doc.url) {
            $scope.selectedType = typeOfDoc(doc.url);
          } else {
            $scope.selectedType = 'other';
          }
          //  $scope.dbDocument = Document.get({
          //    id: doc.id
          //  });
        };
        $scope.typeChange = function() {
          console.log("In typeChange");
        };
        $scope.changeCategory = function() {
          //console.log("In changeCategory");
          var oldCat = $scope.selectedItem.category_id;
          $scope.selectedItem.category_id = $scope.selectedCategory.id;

          //  Need to move document from one category list to the other
          //console.log("Calling function with " + $scope.selectedCategory.id + " and " + $scope.selectedItem.id);
          var catListIndex = findDocIndexFromCatList(oldCat, $scope.selectedItem.id);
          //console.log("Need to delete item " + catListIndex);
          $scope.docsByCat[oldCat].splice(catListIndex, 1);
          $scope.docsByCat[$scope.selectedCategory.id].push($scope.selectedItem);

        };



        $scope.findDocIndexFromList = function(id) {
          for (var i = 0; i < $scope.documentList.length; i++) {
            if ($scope.documentList[i].id == id) {
              return i;
            }
          }
          return null;
        };
        $scope.findDocFromList = function(id) {
          for (var i = 0; i < $scope.documentList.length; i++) {
            if ($scope.documentList[i].id == id) {
              return $scope.documentList[i];
            }
          }
          return null;
        };

        function findDocIndexFromCatList(catid, id) {
          var catlist = $scope.docsByCat[catid];
          for (var i = 0; i < catlist.length; i++) {
            if (catlist[i].id == id) {
              return i;
            }
          }
          return null;
        }

        $scope.deleteDoc = function() {
          function cleanup(delDoc) {
            $scope.docsByCat[delDoc.category_id].splice(findDocIndexFromCatList(delDoc.category_id, delDoc.id), 1);
            $scope.documentList.splice($scope.findDocIndexFromList(delDoc.id), 1);
            $scope.selectedItem = null;
            $state.go('techBooks.default');

          }
          if (confirm("Are you sure you want to delete this document?\n\n" + $scope.selectedItem.title)) {
            var delDoc = $scope.selectedItem;
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

        $scope.saveDoc = function() {
          alert("Saving Document\n\n" + $scope.selectedItem.title);

          if ($scope.selectedItem.id) {
            Document.update({
              id: $scope.selectedItem.id
                //            }, $scope.selectedItem, function() {
            }, {
              document: $scope.selectedItem
            }, function() {
              console.log("Update successful");
              // Write Message to Toast
            }, function(error) {
              alert("Document.update returned error -> " + JSON.stringify(error));
            });
          } else {
            Document.create({
              document: $scope.selectedItem
            }, function() {
              console.log("Create successful");
              // Write Message to Toast
            }, function(error) {
              alert("Document.create returned error -> " + JSON.stringify(error));
            });
          }
        }

        function getTagThresholds() {
          var sumHits = 0,
            maxHits = 0;
          angular.forEach($scope.tagCloud, function(tag) {
            maxHits = (tag.count > maxHits) ? tag.count : maxHits;
          });
          return maxHits;

        }

        $scope.tagFrequencyClass = function(tag) {
          var cssIncr;
          if (tag.count == 1) {
            cssIncr = 1;
          } else {
            var cssIncr = Math.ceil((Math.log(tag.count) / Math.log($scope.tagMaxHits)) * 4);
          }
          //console.log("Tag: " + tag.name + " Count: " + tag.count + " Offset = " + cssIncr + ", maxHits = " + $scope.tagMaxHits);
          return "tagCss" + cssIncr;
        };

        $scope.getTagCloud = function() {
          //console.log("In getTagCloud");
          $http({
            method: 'GET',
            url: 'http://localhost:3000/documents/tag_cloud',
            headers: {
              'Accept': 'application/json'
            }
          }).then(function successCallback(response) {
            // alert("Got tag cloud");
            $scope.tagCloud = response.data;
            $scope.tagMaxHits = getTagThresholds();
          }, function errorCallback(response) {
            alert("Request for Tag Cloud yielded error: " + response.status);
          });

        };

        $scope.queryGoogle = function() {
          var parms = {
            title: $scope.selectedItem.title,
          };
          if (($scope.selectedItem.author) && ($scope.selectedItem.author != 'Unknown')) {
            parms.author = $scope.selectedItem.author;
          }
          if (($scope.selectedItem.publisher) && ($scope.selectedItem.publisher != 'Unknown')) {
            parms.publisher = $scope.selectedItem.publisher;
          }
          $http({
            method: 'GET',
            url: '/api/books',
            params: parms
          }).then(function successCallback(response) {
            //alert("Query successful:  " + JSON.stringify(response.data));
            console.log("Query successful:  " + JSON.stringify(response.data));
            if (response.data.title) {
              $scope.selectedItem.title = response.data.title;
              $scope.selectedItem.author = response.data.author;
              $scope.selectedItem.publisher = response.data.publisher;
              $scope.selectedItem.copywrite = response.data.copywrite;
              $scope.selectedItem.image_url = response.data.image_url;
              $scope.selectedItem.description = response.data.description;
            } else {
              alert("No results for Google Query!");
            }

          }, function errorCallback(response) {
            alert("Google Query Request yielded error(" + response.status + "): " + response.statusText);
          });
        };

        $scope.toggleStarred = function() {
          if ($scope.config.starredHash[$scope.selectedItem.id]) {
            delete $scope.config.starredHash[$scope.selectedItem.id];
            for (var i = 0; i < $scope.starredDocs.length; i++) {
              if ($scope.starredDocs[i] === $scope.selectedItem) {
                $scope.starredDocs.splice(i, 1); // Delete out of array
                break;
              }
            }
          } else {
            $scope.config.starredHash[$scope.selectedItem.id] = true;
            $scope.starredDocs.push($scope.selectedItem);
          }
          saveConfig();
        };

        $scope.starredIcon = function() {
          if ($scope.selectedItem) {
            if ($scope.selectedItem.id) {
              if ($scope.config.starredHash[$scope.selectedItem.id]) {
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

        $scope.readEpub = function(target) {
          var storeString = angular.toJson({ url: target });
          localStorage.setItem("epub2read", storeString);

          window.open("/epub/reader/");

        }

      }
    ]); // end controller
})();
