'use strict';

(function() {

  function UserResource($resource) {
//    return $resource('/api/users/:id/:controller', {
    return $resource('http://localhost:3000/document/:id', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('myappApp')
    .factory('Document', DocumentResource);
})();
