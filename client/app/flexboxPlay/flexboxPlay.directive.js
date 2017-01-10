'use strict';

angular.module('myappApp')
   .directive('flexboxplay', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'flexboxPlayCtrl',
       templateUrl: 'app/flexboxPlay/flexboxPlay.html',
       css: 'app/flexboxPlay/flexboxPlay.css'
     };
});
