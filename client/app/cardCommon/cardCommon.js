'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cardCommon', {
        url: '/cards',
        component: 'cardCommonComponent',
        params: {
          collection: null
        },
        resolve : {
          collection: function($transition$) {
            //console.log("cardCommony.resolve.collection: transition => " + JSON.stringify($transition$.params()));
            return $transition$.params().collection;
          }
        }
    });

  });
