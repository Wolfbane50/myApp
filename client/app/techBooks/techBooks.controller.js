'use strict';

(function() {

  angular.module('myappApp')
    .controller('techBooksCtrl', ['$scope', '$http', function($scope, $http) {

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




    $scope.getCategories = function () {
      console.log("In getCategories");
      $http({
        method: 'GET',
        url: 'http://localhost:3000/categories/',
        headers: {
          'Accept' : 'application/json'
        }
      }).then(function successCallback(response) {
        alert("Got category data ");
          $scope.categories = response.data;
          console.log("--Categories--" + JSON.stringify(response.data) );

      }, function errorCallback(response) {
        alert("Request for Categories data yielded error: " + response.status);
      });
      return $scope.categories;

    };

    $scope.getCategories();
    // Create some sample data
    $scope.staticCategories = [{
       name: "Perl",
       id : 1
    } , {
       name: "C++",
       id : 2
    } , {
       name: "OS and Networks",
       id : 3
    } , {
       name: "Ruby",
       id : 4
    } ];

    $scope.documents = [ {
        category: 1,
        docs: [ {
           id: "1.1",
           name : "First Perl Book",
           tags : [ "tag1", "tag2", "tag3"]
        } , {
           id: "1.2",
           name : "Second Perl Book",
           tags : [ "tag4", "tag2", "tag3"]
        } , {
           id: "1.3",
           name : "Third Perl Book",
           tags : [ "tag4", "tag2", "tag3"]
        } , {
           id: "1.4",
           name : "Fourth Perl Book",
           tags : [ "tag4", "tag2", "tag3"]
        } ]
    } , {
        category: 2,
        docs: [ {
           id: "2.1",
           name : "First C++ Book",
           tags : [ "tag1", "tag2", "tag3"]
        } , {
           id: "2.2",
           name : "Second C++ Book",
           tags : [ "tag4", "tag2", "tag3"]
        } ]
    } , {
        category: 3,
        docs: [ {
           id: "3.1",
           name : "First Networks Book",
           tags : [ "tag1", "tag2", "tag3"]
        } , {
           id: "3.2",
           name : "Second Networks Book",
           tags : [ "tag4", "tag2", "tag3"]
        } ]
    } , {
        category: 4,
        docs: [ {
           id: "4.1",
           name : "First Ruby Book",
           tags : [ "tag1", "tag2", "tag3"]
        } , {
           id: "4.2",
           name : "Second Ruby Book",
           tags : [ "tag4", "tag2", "tag3"]
        } ]

    } ];

    $scope.getDocsByCategory = function (cat) {
      console.log("In getDocsByCategory, documents length = " + $scope.documents.length);
      console.log("Looking for cat = " + cat);
      var i;
      for(i=0; i < $scope.documents.length; i++) {
        var docSet = $scope.documents[i];
        console.log("Checking set with category = " + docSet.category );
        if (docSet.category == cat) {
          return docSet.docs;
        }
      }
      console.log("Returning empty...");
      return [];
    };


    }]); // end controller
})();
