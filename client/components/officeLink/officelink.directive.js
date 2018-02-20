'use strict';

angular.module("myappApp").directive("office", function($http, ngToast) {
    function callDoit(link) {
      // Problem:  Link is caching
      $http({
        url: '/api/doit',
        cache: false,
        method: 'GET',
        params: {
          "file": link
        }
      }).then(response => {
        console.log("Got good response from doit");
        ngToast.create("File should open...");
      }, function errorCallback(response) {
        var newFile = link;
        newFile = prompt(
                   "Request for doit yielded error: " + response.status + " : " + response.data, link);
        if(newFile) {
          callDoit(newFile);
        }
      });

    }

    return {
      link: function postLink(scope,elem,attrs) {
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
          var extension =  link.substr(link.lastIndexOf('.'));
          if(myDomainUrl.origin === parsedLink.origin) {

            console.log("Checking extension => "  + extension);
            if (officeExts[extension]) {
             console.log("Sending to doit, ext = " + extension);
             callDoit(link);

             return false
           }
         } else {
           console.log("Link protocol is " + parsedLink.protocol);
           if(parsedLink.protocol === "file:"){
             if (officeExts[extension]) {
               // Chop of leading 'file:'
               var fname = link.replace(/^file\:\/+/, "");
               console.log("Sending to doit: " + fname);
               callDoit(fname);
               return false;
             }
           }

         }
          console.log("failed to qualify (" + link + "). go with regular link");
          return true;

        })
      }
    }
  });
