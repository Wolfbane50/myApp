angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('charityBag', {
        url: '/charity_bag',
        template: '<charity-bag></charity-bag>'
      });
  });
