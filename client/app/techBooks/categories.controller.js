'use strict';

(function() {

    angular.module('myappApp')
      .controller('categoriesController', ['$scope', '$http', 'Category',
        function($scope, $http, Category) {
          var editFlags = {};
          for (var i = 0; i < $scope.categories.length; i++) {
            var catId = $scope.categories[i].id;
            editFlags[catId] = false;
          }

          $scope.isEditCat = function(id) {
            return editFlags[id];
          };

          $scope.toggleEdit = function(id) {
            editFlags[id] = !editFlags[id];
          }

          $scope.deleteCat = function(cat) {
            if (confirm("Are you sure you want to delete this category?\n\n" + cat.name)) {
              Category.delete({
                id: cat.id
              }, function() {
                console.log("Delete successful");
                // Need to delete from the local list.
                // Note:  Not cleaning up any documents with the deleted category ID - assuming that will not be necessary
                $scope.getCategories();
              }, function(error) {
                alert("Document.delete returned error -> " + JSON.stringify(error));
              });

            }
          };

          $scope.createCat = function() {
            var newCatName = prompt("Name of new category: ");
            if (newCatName) {
              Category.create({
                  name: newCatName
                },
                function() {
                  console.log("Create successful");
                  $scope.getCategories();
                  // Write Message to Toast
                },
                function(error) {
                  alert("Category.create returned error -> " + JSON.stringify(error));
                });
          }
        };

        $scope.updateCat = function(cat) {
          Category.update({
            id: cat.id
          }, cat, function() {
            console.log("Update successful");
            $scope.toggleEdit(cat.id);
            // Write Message to Toast
          }, function(error) {
            alert("Category.update returned error -> " + JSON.stringify(error));
          });

        };


      }]); // end controller
})();
