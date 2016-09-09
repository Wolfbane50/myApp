'use strict';

angular.module('myappApp')
   .directive('gdriveIdTable', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'gdriveIdTableCtrl',
       templateUrl: 'app/gdriveIdTable/gdriveIdTable.html',
       css: 'app/cardCommon/gdriveIdTable.css'
     };
});
