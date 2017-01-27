'use strict';

(function() {
  class DocumentListComponent {
  constructor() {
    this.docs = [];

    // define all functions
    this.addDoc = function(doc) {
      this.docs.push(doc);
    }
  }  // end constructor

  $onInit() {
  } // end onInit
} // end component class

angular.module('myappApp')
  .component('documentListComponent', {
    bindings: { docs: '<' },
    templateUrl: 'app/techBooks/documentList.html',
    controller: DocumentListComponent
  });

})();
