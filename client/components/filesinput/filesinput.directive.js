'use strict';

angular.module("myappApp").directive("filesInput", function() {
  return {
    require: "ngModel",
    link: function postLink(scope, elem, attrs, ngModel) {

      elem.on("change", function(e) {
        console.log("FilesInput Change Event occurred!");
        var fileVal = elem[0].value;
        //var props = Object.getOwnPropertyNames(elem[0]);
        var props = Object.getOwnPropertyNames(scope);
        var onFileChange = attrs.onFileChange;
        console.log("Set fileval to " + fileVal + "; props = " + JSON.stringify(props));
//        var path = URL.createObjectURL(fileVal);
  if (attrs.onFileChange) {
          var callbackName = attrs.onFileChange.replace(/\$ctrl\./, '');
          console.log("Calling onFileChange as " + callbackName);
          scope.$ctrl[callbackName](elem);

          //scope.fileNameChanged();
        }

      });
    }
  }
});
