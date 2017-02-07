'use strict';

(function() {
  class TaggedDocsComponent {
  constructor($http, $stateParams) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.tagDocs = [];

    // define all functions
    this.select = function(document) {
      console.log("taggedDocs.select called, passing through, doc => " + JSON.stringify(document));
      this.onSelect(document);
    };
  }  // end constructor

  $onInit() {
    this.selectedTag = this.$stateParams.tag;
    console.log("taggedDocsComponent.onInit selState =" + this.selState + " stateParams" + JSON.stringify(this.$stateParams) );
    // go get the tagged documents
    var ctrl = this;
    this.$http({
      method: 'GET',
//            url: 'http://localhost:3000/documents/tag',
      url: '/api/books/tag',
      params: { id: this.selectedTag },
      headers: {
        'Accept': 'application/json'
      }
    }).then(function successCallback(response) {
      //alert("Got tag cloud");
      ctrl.tagDocs = response.data;
    }, function errorCallback(response) {
      alert("Request for Tagged Documents yielded error: " + response.status);
    });
  } // end onInit
} // end component class

angular.module('myappApp')
  .component('taggedDocsComponent', {
    bindings: {
      selState: '<',
    },
    templateUrl: 'app/library/taggedDocs.html',
    controller: TaggedDocsComponent
  });

})();
