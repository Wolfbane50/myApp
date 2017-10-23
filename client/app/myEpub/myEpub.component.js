'use strict';

(function() {
  class MyEpubComponent {
    constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
      } // end constructor

    $onInit() {
    } // end onInit
} // end component class

angular.module('myappApp')
  .component('myEpubComponent', {
    templateUrl: 'app/myEpub/myEpub.html',
    controller: MyEpubComponent
  });

})();
