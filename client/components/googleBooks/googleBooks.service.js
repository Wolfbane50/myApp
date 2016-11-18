'use strict';

(function() {
  function GoogleBooksService(selectedItem) {
    return {
      queryGoogle : function() {
        var parms = {
          title: selectedItem.title,
        };
        if ((selectedItem.author) && (selectedItem.author != 'Unknown')) {
          parms.author = selectedItem.author;
        }
        if ((selectedItem.publisher) && (selectedItem.publisher != 'Unknown')) {
          parms.publisher = selectedItem.publisher;
        }
        $http({
          method: 'GET',
          url: '/api/books',
          params: parms
        }).then(function successCallback(response) {
          //alert("Query successful:  " + JSON.stringify(response.data));
          console.log("Query successful:  " + JSON.stringify(response.data));
          if (response.data.title) {
            selectedItem.title = response.data.title;
            selectedItem.author = response.data.author;
            selectedItem.publisher = response.data.publisher;
            selectedItem.copywrite = response.data.copywrite;
            selectedItem.image_url = response.data.image_url;
          selectedItem.description = response.data.description;
          } else {
            alert("No results for Google Query!");
          }

        }, function errorCallback(response) {
          alert("Google Query Request yielded error(" + response.status + "): " + response.statusText);
        });
      };

    };
  }  // end factory function


  angular.module('myappApp.googleBooks')
    .factory('googleBooks', [ '$http', GoogleBooksService ]);
})();
