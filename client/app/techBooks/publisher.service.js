angular.module('myappApp').factory('Publisher', function($resource) {
  return $resource('/api/books/publishers', {}, {
    query: {
      method: 'GET',
      isArray: false,
      data: false
    },
    create: {
      method: 'POST',
      isArray: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    },
    delete: {
      method: 'DELETE',
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    }

  });

});
