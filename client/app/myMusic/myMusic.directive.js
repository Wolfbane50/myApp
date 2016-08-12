'use strict';

angular.module('myappApp')
   .directive('myMusic', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'myMusicCtrl',
       templateUrl: 'app/myMusic/myMusic.html',
       css: 'app/myMusic/myMusic.css'
     };
});
