'use strict';
/* eslint no-sync: 0 */

(function() {

  class NavbarComponent {
    constructor($location, $scope, $rootScope) {
        'ngInject';

        this.$location = $location;
        this.isCollapsed = true;
        var navScope = this;
        //console.log("Constructor being called");
        //this.isLoggedIn = Auth.isLoggedInSync;
        //this.isAdmin = Auth.isAdminSync;
        //this.getCurrentUser = Auth.getCurrentUserSync;

        // Collapse the Navbar when changing state.
        $rootScope.$on('$stateChangeStart',
           function(event, toState, toParams, fromState, fromParams) {
             console.log("Changing state...");
             navScope.isCollapsed = true;
           });






      } //end of contstructor

    $onInit() {
      //console.log("On init being called");
      this.isCollapsed = true;
    }

  }

  angular.module('myappApp')
    .component('navbar', {
      templateUrl: 'components/navbar/navbar.html',
      controller: NavbarComponent
    });


})();
