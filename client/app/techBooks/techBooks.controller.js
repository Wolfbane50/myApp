'use strict';

(function() {

  angular.module('myappApp')
    .controller('techBooksCtrl', ['$scope', '$http', 'Category', 'Document', function($scope, $http, Category, Document) {

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
      //      get "documents/tag"        - Returns HTML for list of documents with a given tag
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
      $scope.itemSelect = function(doc) {
        $scope.selectedItem = doc;
        $scope.dbDocument = Document.get({
          id: doc.id
        });
        //        $http({
        //          method: 'GET',
        //          url: 'http://localhost:3000/documents/' + doc.id + '/edit',
        //          headers: {
        //            'Accept': 'application/json'
        //          }
        //        }).then(function successCallback(response) {
        //           $scope.dbDocument = response.data;
        //        }, function errorCallback(response) {
        //          alert("Request for Document data yielded error: " + response.status);
        //        });
      };

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

    }]); // end controller
})();
