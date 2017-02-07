'use strict';

(function() {
  class DummyDocComponent {
    constructor($stateParams, $state) {
    this.doc = {};
    this.$stateParams = $stateParams;

    // define all functions
    this.$onChanges = function(changes) {
      console.log("dummyDocComponent.onChange $stateParams => " + JSON.stringify(this.$stateParams));
      console.log("dummyDocComponent.onChanges, doc => " + JSON.stringify(this.doc));
          console.log("Libdoc onChanges fired, changes => " + JSON.stringify(changes));
      //  If no change occured to an attribute, it will have previousValue but not currentValue;
      if ((changes.doc) && (changes.doc.currentValue)) {
//            console.log("   Accepting changes");
         this.doc = changes.doc.currentValue;
      } else {
        console.log("dummyDocComponent.onChanges: No doc object in changes");
        this.doc = this.$stateParams.document;
      }
    };  }  // end constructor

  $onInit() {
    console.log("dummyDocComponent.onInit $stateParams => " + JSON.stringify(this.$stateParams));
    //this.doc = this.$stateParams.document;
    console.log("dummyDocComponent.onInit doc => " + JSON.stringify(this.doc));

  } // end onInit
} // end component class

angular.module('myappApp')
  .component('dummyDocComponent', {
    bindings: {
      doc: '<', // Pointer to document record
    },
    template: '<h2>Document Selected:  {{ $ctrl.doc.title }}</h2>',
    controller: DummyDocComponent
  });

})();
