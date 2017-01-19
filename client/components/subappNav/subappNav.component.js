'use strict';
/* eslint no-sync: 0 */

(function() {

  angular.module('myappApp')
    .component('subappNavbar', {
      transclude: true,
      bindings : {
        name: '@',
        state: '@'
      },
      controller: function SubappNavbarComponent () {
        var navs = this.navs = [];
        this.isCollapsed = true;
        this.$onInit = function() {
          console.log("In navbar.onInit, name = " + this.name + ", state =  "+ this.state);
        };
        this.toggleNav - function() {
          this.isCollapsed = !(this.isCollapsed);
        };
        this.addNav = function(nav) {
          navs.push(nav);
        };
      },
      templateUrl: 'components/subappNav/subappNavbar.html'

    })
    .component('subappNav', {
      transclude: true,
      bindings: {
        onAction: '&'
      },
      require: {
        navsCtrl: '^subappNavbar'
      },
      templateUrl: 'components/subappNav/subappNav.html',
      controller: function() {
        this.$onInit = function() {
          console.log("Adding nav from nav.onInit, action = " + this.action);
          this.navsCtrl.addNav(this);
        };
        this.action = function() {
          //alert("Callback in Nav, will forward to " + this.onAction);
          this.onAction();
        };

      }
    });


})();
