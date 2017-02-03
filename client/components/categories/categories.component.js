'use strict';

(function() {
  class CategoryComponent {
  constructor(Category, ngToast) {
    this.ngToast = ngToast;
    this.Category = Category;
    this.editFlags = {};

    // define all functions
    this.isEditCat = function(id) {
      return this.editFlags[id];
    };

    this.toggleEdit = function(id) {
      this.editFlags[id] = !(this.editFlags[id]);
    };

    this.updateCategoriesLocal = function() {
        this.categories = this.Category.query();
        this.ngToast.create("Categories updated!");
        this.onCategoryUpdate();      // Notify anyone else interested - Consider changing to event
    };

    this.deleteCat = function(cat) {
      if (confirm("Are you sure you want to delete this category?\n\n" + cat.name)) {
        Category.delete({
          id: cat.id
        }, function() {
          console.log("Delete successful");
          // Need to delete from the local list.
          // Note:  Not cleaning up any documents with the deleted category ID - assuming that will not be necessary
          this.updateCategoriesLocal();
        }, function(error) {
          alert("Document.delete returned error -> " + JSON.stringify(error));
        });

      }
    };

  this.createCat = function() {
      var newCatName = prompt("Name of new category: ");
      if (newCatName) {
        Category.create({
            name: newCatName
          },
          function() {
            console.log("Create successful");
            this.updateCategoriesLocal();

          },
          function(error) {
            alert("Category.create returned error -> " + JSON.stringify(error));
          });
    }
  };

  this.updateCat = function(cat) {
    Category.update({
      id: cat.id
    }, cat, function() {
      console.log("Update successful");
      this.toggleEdit(cat.id);
      this.updateCategoriesLocal();
      // Write Message to Toast
    }, function(error) {
      alert("Category.update returned error -> " + JSON.stringify(error));
    });

  };
  }  // end constructor

  $onInit() {
    this.categories = this.Category.query();
    for (var i = 0; i < this.categories.length; i++) {
      var catId = this.categories[i].id;
      this.editFlags[catId] = false;
    }

  } // end onInit
} // end component class

angular.module('myappApp')
  .component('categoryComponent', {
    bindings: {
      onCategoryUpdate: '&'
    },
    templateUrl: 'components/categories/categories.html',
    controller: CategoryComponent
  });

})();
