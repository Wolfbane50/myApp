'use strict';

(function() {

  angular.module('myappApp')
    .controller('techBooksCtrl', ['$scope', '$http', '$state', 'Category', 'Document', 'Publisher',
           function($scope, $http, $state, Category, Document, Publisher) {

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
      //$scope.publishers = Publisher.query(function() {
      //  console.log("Got publishers: " + JSON.stringify($scope.publishers));
      //}, function(error) {
      //console.log("Get publishers returned error: " + JSON.stringify(error));
      //});
      $scope.publishers = [
        "O\'Reilly" ,
        'APress' ,
        'Manning' ,
        'McGraw Hill' ,
        'MS Press' ,
        'No Starch' ,
        'Packt' ,
        'Peachpit Press' ,
        'Prentice Hall' ,
        'Pragmatic Publishing' ,
        'Sams' ,
        '7 Summits' ,
        'Wrox' ,
        'Addison Wesley'
      ];
      $scope.docTypes = { 'Book' : 1, 'Presentation' : 2, 'Link' : 3, 'Whitepaper' : 4, 'Schedule' : 5};
      $scope.getCategories();
      // Create some sample data

      $scope.docsByCat = {};
      $scope.docsByTag = {};
      $scope.tagList = [];
      $scope.selectedItem;
      $scope.dbDocument = {};
      $scope.editCategories = false;

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

            // index by tag
            if (doc.tag_id) {
              console.log("Processing tag " + doc.tag_id);
              var myTags = doc.tag_id.split(", ");
              anglular.forEach(myTags, function(myTag) {
                if ($scope.docsByTag[myTag]) {
                  $scope.docsByTag[myTag].push(doc);
                } else {
                  $scope.docsByTag[myTag] = [doc];
                }
              });
            }

          });
          // Create sorted list of tags
          $scope.tagList = [];
          for (var key in $scope.docsByTag) {
            $scope.taglist.push(key);
          }
          $scope.tagList = $scope.tagList.sort();

        });

      };

      $scope.getAndOrganizeDocuments();
      $state.go('techBooks.default');

      $scope.newDoc = function(catid) {
        console.log("In newDoc...");
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
          category_id: myCatId
        };
        $scope.documentList.push(myDoc);
        $scope.docsByCat[myCatId].push(myDoc);
        $scope.itemSelect(myDoc);
      };

      $scope.revert = function() {
        // User may select other document before call to database is complete
        console.log("In revert...");
        var revertDoc = $scope.selectedItem;

        var revertedDoc = Document.get({
          id: revertDoc.id
        }, function() {
          // Deepcopy over local copy from database
          angular.copy(revertedDoc, revertDoc);
          //alert("Document Updated");
        });

      };
      function catNameFromIndex (idx) {
        for (var i=0; i<$scope.cateories.length; i++) {
          cat = $scope.categories[i];
          if (cat.id == idx) {
            return cat.name;
          }
        }
        return null;
      }

      $scope.itemSelect = function(doc) {
        $scope.selectedItem = doc;
        $scope.selectedCategory = $scope.categories[parseInt(doc.category_id) - 1];
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



      $scope.findDocIndexFromList = function (id) {
        for (var i = 0; i < $scope.documentList.length; i++) {
          if ($scope.documentList[i].id == id) {
            return i;
          }
        }
        return null;
      };
      $scope.findDocFromList = function (id) {
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
          $scope.documentList.splice(findDocIndexFromList(delDoc.id), 1);
          $scope.selectedItem = null;

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
          }, $scope.selectedItem, function() {
            console.log("Update successful");
            // Write Message to Toast
          }, function(error) {
            alert("Document.update returned error -> " + JSON.stringify(error));
          });
        } else {
          Document.create( $scope.selectedItem, function() {
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
      }

    }]); // end controller
})();
