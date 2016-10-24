'use strict';

angular.module('myappApp')
   .directive('loadstage', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'loadstageCtrl',
       templateUrl: 'app/loadstage/loadstage.html',
       css: 'app/loadstage/loadstage.css'
     };
});
