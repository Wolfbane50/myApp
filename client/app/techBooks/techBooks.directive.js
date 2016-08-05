'use strict';

angular.module('myappApp')
   .directive('techBooks', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'techBooksCtrl',
       templateUrl: 'app/techBooks/techBooks.html',
       css: 'app/dirExplorer/techBooks.css'
     };
});
