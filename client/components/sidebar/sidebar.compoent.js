'use strict';
/* eslint no-sync: 0 */

(function() {

  angular.module('myappApp')
    .component('sidebar', {
      transclude: true,
      bindings : {
      },
      controller: function () {
        this.isSideOpen = false;
        this.toggleSide = function() {
          this.isSideOpen = !(this.isSideOpen);
          console.log("Toggling Side Open to " +  this.isSideOpen);
        };
        this.$onInit = function() {
          console.log("sidebar.onInit");
        };
      },
      templateUrl: 'components/sidebar/sidebar.html'

    });


})();
