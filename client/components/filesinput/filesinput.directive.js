'use strict';

angular.module("myappApp").directive("filesInput", function() {
    return {
      require: "ngModel",
      link: function postLink(scope,elem,attrs,ngModel) {
        elem.on("change", function(e) {
//          var files = elem[0].files;
          var fileVal = elem[0].value;
        //  console.log("Value => " + fileVal);

          ngModel.$setViewValue(fileVal);
        })
      }
    }
  });
