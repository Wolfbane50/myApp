'use strict';

angular.module('myappApp')
  .directive('toast', () => ({
    templateUrl: 'components/toast/toast.html',
    restrict: 'E',
    controller: 'ToastController',
    controllerAs: 'toast'
  }));
