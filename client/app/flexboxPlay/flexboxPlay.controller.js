'use strict';

(function() {

  class FlexboxPlayComponent {
    constructor() {
      // Do I need the navbar/nav here ?
      this.isSideOpen = false;
      this.toggleSide = function() {
        this.isSideOpen = !(this.isSideOpen);
        console.log("Toggling Side Open to " +  this.isSideOpen);
      };
      this.cb1 = function() {
          alert("Callback One");
        };
      this.cb2 = function() {
          alert("Callback Two");
        };
    } // end constructor
    $onInit() {
      console.log("Ran onInit for flexboxPlay component");
    } // end onInit

  } // end class for component

  angular.module('myappApp')
    .component('flexboxPlayComponent', {
      controller: FlexboxPlayComponent,
      // styleUrls: [ 'app/flexboxPlay/flexboxPlay.css' ],  Angular 2 feature
      templateUrl: 'app/flexboxPlay/flexboxPlay.html'
    });

})();
