angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('charityBag', {
        url: '/charity_bag',
        component: 'charityBagComponent'
      });
  });
