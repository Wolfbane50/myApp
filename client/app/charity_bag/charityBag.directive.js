'use strict';

angular.module('myappApp')
   .directive('charityBag', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'charityBagCtrl',
       templateUrl: 'app/charity_bag/charityBag.html'
     };
});
