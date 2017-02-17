angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('charityBag', {
        url: '/charity_bag',
        component: 'charityBagComponent'
      )
      .state('charityBag.report', {
        component: 'charityReport'
        parameters: {
          bagReport: null,
          trips: null
        },
        resolve: {
          bagReport: function($transition$) {
            //console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().bagReport;
          },
          trips:function($transition$) {
            //console.log("library.docdisp.resove: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().trips;
          }
        }
      });
  });
