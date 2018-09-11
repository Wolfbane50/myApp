
angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gearsMixins', {
        url: '/gears-mixins',
        component: 'gearsMixinsComponent'
      });
  });
