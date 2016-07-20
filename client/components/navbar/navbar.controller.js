'use strict';

class NavbarController {
  //end-non-standard


  //start-non-standard
  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.menu = [
      {
        title : 'Sprite Grid Example',
        state : 'spGridExample'
      },
      {
        title : 'Big Finish Grid View',
        state : 'bfGrid'
      }
    ];

  }

}

angular.module('myappApp')
  .controller('NavbarController', NavbarController);
