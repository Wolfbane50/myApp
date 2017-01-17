'use strict';
/* eslint no-sync: 0 */

(function() {

  angular.module('myappApp')
    .component('subapp-navbar', {
      transclude: true,
      bindings : {
        name: '@',
        state: '@'
      },
      controller: function SubappNavbarComponent () {
        var navs = this.navs = [];
        this.isCollapsed = true;
        this.$onInit = function() {
          console.log("In navbar.onInit");
        };
        this.addNav = function(nav) {
          navs.push(nav);
        };
      },
      templateUrl: 'components/subappNav/subappNavbar.html'

    })
    .component('subapp-nav', {
      transclude: true,
      bindings: {
        action: '@'
      },
      require: {
        navsCtrl: '^subapp-navbar'
      },
      templateUrl: 'components/subappNav/subappNavbar.html',
      controller: function() {
        this.$onInit = function() {
          console.log("Adding nav from nav.onInit");
          this.navsCtlr.addNav(this);
        }
      }
    });


})();
