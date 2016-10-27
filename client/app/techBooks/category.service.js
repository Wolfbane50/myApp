angular.module('myappApp').factory('Category', function($resource) {
  return $resource('/api/books/categories/:id', {}, {
    query: {
      method: 'GET',
      isArray:true,
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
