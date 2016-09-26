'use strict';

(function() {

  angular.module('myappApp')
    .factory('Document', function($resource) {
      return $resource('http://localhost:3000/documents/:id', { id: '@id' }, {
        query: {
          method: 'GET',
          isArray:true,
          data: false,
          headers: {
            'Content_Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
        get: {
          method: 'GET',
          data: false,
          headers: {
            'Content_Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
      });
    });

})();
