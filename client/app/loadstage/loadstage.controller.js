'use strict';

(function() {

  angular.module('myappApp')
    .controller('loadstageCtrl', ['$scope', '$http', '$state', 'Category', 'Document', 'Publisher',
           function($scope, $http, $state, Category, Document, Publisher) {
             $scope.getCategories = function() {
               //console.log("In getCategories");
               $scope.categories = Category.query(function() {
                 console.log('Got categories');
                 //console.log(JSON.stringify($scope.categories));
               });
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
             $scope.selectedItem;
             $state.go('loadstage.default');
             var stachedDoc = {};


             $scope.revert = function() {
               // User may select other document before call to database is complete
               console.log("In revert...");
               angular.copy(stachedDoc, $scope.selectedItem);
             };

             $scope.stachDoc = function () {
               angular.copy($scope.selectedItem, stachedDoc);
             };

             $scope.itemSelect = function(doc) {
               $scope.selectedItem = doc;
               $scope.selectedCategory = $scope.categories[parseInt(doc.category_id) - 1];
               //  $scope.dbDocument = Document.get({
               //    id: doc.id
               //  });
             };
             $scope.changeCategory = function() {
               //console.log("In changeCategory");
               var oldCat = $scope.selectedItem.category_id;
               $scope.selectedItem.category_id = $scope.selectedCategory.id;
             };

             $scope.deleteDoc = function() {
               if (confirm("Are you sure you want to delete this document?\n\n" + $scope.selectedItem.title)) {
                 $scope.stageDocs.splice( $scope.selectedIndex, 1);
                 $scope.selectedItem = null;
                 $state.go('loadstage.default');
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
             };

             $scope.queryGoogle = function() {
               $scope.stachDoc();
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

             $scope.getStageDocs = function() {
               $scope.stageDir = prompt("Enter Staging Directory", "C:/Users/daniel.heaney/Documents/ebooks");
               if($scope.stageDir) {
                 //console.log("In getTagCloud");
                 $http({
                   method: 'GET',
                   url: '/api/books/loadstage',
                   params: {
                     stage_directory : $scope.stageDir
                   },
                   headers: {
                     'Accept': 'application/json'
                   }
                 }).then(function successCallback(response) {
                   // alert("Got staged docs");
                   console.log("Received data: " + JSON.stringify(response.data));
                   $scope.stageDocs = response.data.items;
                   // Set up defaults for document fields
                   angular.forEach($scope.stageDocs, function(doc) {

                       //doc.id = null; // What the server would expect on save for create.
                       doc.author = null;
                       // publisher: null,    // May need this
                       doc.image_url = "http://localhost:3000/assets/document.gif";
                       doc.category_id = 10;  // Uncategorized
                       doc.type_id = 1;       // Book
                       doc.url = doc.name;

                   });
                 }, function errorCallback(response) {
                   alert("Request for Staged Docs yielded error: " + response.status);
                 });

               }
             }

    }]); // end controller
})();