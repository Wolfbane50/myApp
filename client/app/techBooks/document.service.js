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
        create: {
          method: 'POST',
          isArray: false,
          headers: {
            'Content_Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
        update: {
          method: 'PUT',
          isArray: false,
          headers: {
            'Content_Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
        delete: {
          method: 'DELETE',
          data: false,
          headers: {
            'Content_Type': 'application/json',
            'Accept' : 'application/json'
          }
        }
      });
    });

})();
