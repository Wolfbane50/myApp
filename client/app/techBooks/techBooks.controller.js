'use strict';

(function() {

  angular.module('myappApp')
    .controller('techBooksCtrl', ['$scope', '$http', function($scope, $http) {

    console.log("In techBooks Init");

    $scope.getCategories = function () {
      console.log("In getCategories");
      return $scope.categories;
    };

    $scope.getDocsByCategory = function (cat) {
      console.log("In getDocsByCategory");
      angular.forEach($scope.documents, function(docSet) {
        if (docSet.category == cat) {
          return docSet.docs;
        }
      });
      return [];
    };

    // Create some sample data
    $scope.categories = [{
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
    }]); // end controller
})();
