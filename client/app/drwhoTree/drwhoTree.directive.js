'use strict';

angular.module('myappApp')
   .directive('drwhoTree', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'drwhoTreeCtrl',
       templateUrl: 'app/drwhoTree/drwhoTree.html',
       css: 'app/drwhoTree/drwhoTree.css'
     };
});
