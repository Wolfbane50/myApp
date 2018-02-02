'use strict';

angular.module("myappApp").directive("office", function() {
    return {
      link: function postLink(scope,elem,attrs,ngModel) {
        elem.on("click", function(e) {
//          var files = elem[0].files;
          var officeExts = {
            ".doc" : 1,
            ".docx" : 1,
             ".xls" : 1,
             ".xlsm" : 1,
             ".pptx" : 1,
             ".ppt" : 1,
             ".pdf" : 1,
             ".mpp" : 1
          };
          var link = elem[0].href;
          var myDomainUrl = new URL(document.URL);
          var parsedLink = new URL(link);
          if(myDomainUrl.origin === parsedLink.origin) {
            var extension =  link.substr(link.lastIndexOf('.'));
            console.log("Checking extension => "  + extension);
            if (officeExts[extension]) {
             console.log("Sending to doit, ext = " + extension);
             $http({
               url: '/api/doit',
               method: 'GET',
               params: {
                 "file": link
               }
             }).then(response => {
               ctrl.ngToast.create("File should open...");
             });

             return false
           }
          }
          console.log("failed to qualify (" + link + "). go with regular link");
          return false;
          //return true;

        })
      }
    }
  });
