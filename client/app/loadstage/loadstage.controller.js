'use strict';

(function() {

  angular.module('myappApp')
    .controller('loadstageCtrl', ['$scope', '$http', '$state', 'Category', 'Document', 'Publisher', 'googleBooks',
           function($scope, $http, $state, Category, Document, Publisher, googleBooks) {
             $scope.getCategories = function() {
               //console.log("In getCategories");
               $scope.categories = Category.query(function() {
                // console.log('Got categories');
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
             $scope.stageDocs = [];
             $scope.docTypes = { 'Book' : 1, 'Presentation' : 2, 'Link' : 3, 'Whitepaper' : 4, 'Schedule' : 5};
             $scope.getCategories();
             $scope.selectedItem;

             $scope.storageDir = "C:/Users/Daniel/myapp/server/api/books/test_dest_dir";
             var stachedDoc = {};
             $scope.stageResults = {};
             $state.go('loadstage.default');


             $scope.setStorageDir = function () {
               var tmpDir = prompt("Set Storage Directory for Document Library:", "C:/Users/Daniel/myapp/server/api/books/test_dest_dir" )
               if (tmpDir) {
                 $scope.storageDir = tmpDir;
                 if ($scope.storageDir.match(/^\w\:\\/)) {
                    $scope.storageDir = $scope.storageDir.replace(/\\/g, '/');
//                   console.log("Transforming directory to " +  $scope.stageDir);
                 }

               }
             };

             $scope.revert = function() {
               // User may select other document before call to database is complete
//               console.log("In revert...");
               angular.copy(stachedDoc, $scope.selectedItem);
             };

             $scope.stachDoc = function () {
               angular.copy($scope.selectedItem, stachedDoc);
             };

             $scope.itemSelect = function(doc, index) {
               $scope.selectedItem = doc;
               $scope.selectedCategory = $scope.categories[parseInt(doc.category_id) - 1];
               $scope.selectedIndex = index;

               //  $scope.dbDocument = Document.get({
               //    id: doc.id
               //  });
             };
             $scope.changeCategory = function() {
               //console.log("In changeCategory");
               var oldCat = $scope.selectedItem.category_id;
               $scope.selectedItem.category_id = $scope.selectedCategory.id;
             };

             $scope.removeDoc = function(index) {
               var docToDel = $scope.stageDocs[index];
               $scope.stageDocs.splice(index, 1);
               $state.go('loadstage.default');
             };

           $scope.deleteDoc = function() {
               if (confirm("Are you sure you want to delete this document?\n\n" + $scope.selectedItem.title)) {
                 $scope.stageDocs.splice( $scope.selectedIndex, 1);
                 $scope.selectedItem = null;
                 $state.go('loadstage.default');
               }
             };

             $scope.newDoc = function(catid) {
//               console.log("In loadstage newDoc...");
               var myCatId = (catid) ? catid : 10; //'Uncategorized';
               var myDoc = {
                 title: "New Book",
                 author: null,
                 // publisher: null,    // May need this
                 image_url: "http://localhost:3000/assets/document.gif",
                 type_id: 1,
                 category_id: myCatId
               };
               $scope.stageDocs.push(myDoc);
               $state.go('loadstage.stageDocument', {
                 index: ($scope.stageDocs.length - 1)
               });

             };
             $scope.saveDoc = function() {
               alert("Saving Document\n\n" + $scope.selectedItem.title);

               if ($scope.selectedItem.id) {
                 Document.update({
                   id: $scope.selectedItem.id
                 }, $scope.selectedItem, function() {
                   //console.log("Update successful");
                   // Write Message to Toast
                 }, function(error) {
                   alert("Document.update returned error -> " + JSON.stringify(error));
                 });
               } else {
                 Document.create( $scope.selectedItem, function() {
                  // console.log("Create successful");
                   // Write Message to Toast
                 }, function(error) {
                   alert("Document.create returned error -> " + JSON.stringify(error));
                 });
               }
             };

             $scope.queryGoogle = googleBooks.queryGoogle;

             $scope.retrieveLocal = function() {
               var c2DataStr = localStorage.getItem("stageDocs");
               if (c2DataStr) {
                 $scope.stageDocs = angular.fromJson(c2DataStr);
                 var tmpstr = localStorage.getItem("stageDir");
                 if(tmpstr) $scope.stageDir = tmpstr;
                 tmpstr = localStorage.getItem("storageDir");
                  if(tmpstr) $scope.storageDir = tmpstr;
                  $state.go('loadstage.default');
               }
             };
             $scope.commitChanges = function() {
               var c2String = angular.toJson($scope.stageDocs);
               localStorage.setItem("stageDocs", c2String);
               localStorage.setItem("stageDir", $scope.stageDir);
               localStorage.setItem("storageDir",  $scope.storageDir)
               alert("Stage Document Data saved to Local Storage");

             };
             $scope.flushLocal = function() {
               if (confirm("Are you really really sure you want to delete local storage?")) {
                 localStorage.removeItem("stageDocs");
                 localStorage.removeItem("stageDir");
                 localStorage.removeItem("storageDir");
                 alert("Local Storage Deleted!");
               }
             };


             $scope.getStageDocs = function() {
              // $scope.stageDir = prompt("Enter Staging Directory", "C:/Users/daniel.heaney/Documents/ebooks");
               $scope.stageDir = prompt("Enter Staging Directory", "C:/blah/myapp/server/api/books/test_stage_dir");

               if($scope.stageDir) {
                 //console.log("In getTagCloud");
                 // Convert slashes if needed
                 //     Assume windows file would be of format c:\blah\blah
                 if ($scope.stageDir.match(/^\w\:\\/)) {
                    $scope.stageDir = $scope.stageDir.replace(/\\/g, '/');
                 }
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
                   //console.log("Received data: " + JSON.stringify(response.data));
                   $scope.stageDocs = response.data.items;
                   // Set up defaults for document fields
                   angular.forEach($scope.stageDocs, function(doc) {

                       //doc.id = null; // What the server would expect on save for create.
                       doc.author = null;
                       // publisher: null,    // May need this
                       doc.image_url = "http://localhost:3000/assets/document.gif";
                       doc.category_id = 10;  // Uncategorized
                       doc.type_id = 1;       // Book
                       // URL should not have the stage path in it
                       doc.url = doc.name;
                       if (doc.url.indexOf($scope.stageDir) == 0) {  // StageDir in the url
                         doc.url = doc.name.substr($scope.stageDir.length);
                       } else {
                         doc.url = doc.name;
                       }
                       delete doc.name;

                   });
                   $state.go('loadstage.default');

                 }, function errorCallback(response) {
                   alert("Request for Staged Docs yielded error: " + response.status);
                 });

               }
             };
             var validateStageDocs = function() {
               angular.forEach($scope.stageDocs, function(doc) {
                 if(doc.name) {
                   delete doc.name;
                 }
               });
               return true;
             };
             $scope.saveStage = function () {
               if (validateStageDocs()) {
                 $http({
                   method: 'POST',
                   url: '/api/books/savestage',
                   data: {
                     target: $scope.storageDir,
                     documents: $scope.stageDocs,
                     stage_directory : $scope.stageDir
                   },
                   headers: {
                     'Accept': 'application/json'
                   }
                 }).then(function successCallback(response) {
                   // alert("Got staged docs");
                   //console.log("Received data: " + JSON.stringify(response.data));
                    $scope.stageResults = response.data;
                    $state.go('loadstage.displayResults');
               }, function errorCallback(response) {
                 alert("Request for Staged Docs yielded error: " + response.status
                        + ": " + response.data);
               });
             }
           };

    }]); // end controller
})();
