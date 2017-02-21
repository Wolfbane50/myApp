angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('charityBag', {
        url: '/charity_bag',
        component: 'charityBagComponent'
      })
      .state('charityBag.report', {
        component: 'charityReport',
        params: {
          bagReport: null,
          trips: null
        },
        resolve: {
          bagReport: function($transition$) {
            //console.log("bagReport.resolve: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().bagReport;
          },
          trips:function($transition$) {
            //console.log("trips.resolve: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().trips;
          }
        }
      });
  });
