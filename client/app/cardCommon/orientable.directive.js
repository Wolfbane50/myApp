'use strict';

(function() {

  angular.module('myappApp')
    .directive('orientable', function() {
      return {
        link: function(scope, element, attrs) {
          element.bind("load", function(e) {
            if (this.naturalWidth > this.naturalHeight) {
              this.className = "rotate";
            } else {
              this.className = "sizeit";
            }
          });

        }


      };
    });
})();
