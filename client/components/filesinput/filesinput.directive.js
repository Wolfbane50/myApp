'use strict';

angular.module("myappApp").directive("filesInput", function() {
  return {
    require: "ngModel",
    link: function postLink(scope, elem, attrs, ngModel) {

      elem.on("change", function(e) {
        var fileVal;
        if (elem[0].webkitRelativePath) {
          console.log("Got relative path");
          fileVal = elem[0].webkitRelativePath + '/' + elem[0].value;

        } else {
          fileVal = elem[0].value;
        }
        console.log("First file => " + JSON.stringify(elem[0]));
        console.log("Setting ngModel to " + fileVal);
        ngModel.$setViewValue(fileVal);
        if (attrs.onFileChange) {
          //console.log("Calling onFileChange..");
          attrs.onFileChange(e);
        }
      })
    }
  }
});
