angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cpcrTier', {
        url: '/cpcrTier',
        component: 'cpcrTierComponent'
      });
  });
