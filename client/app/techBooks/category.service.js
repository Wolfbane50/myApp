angular.module('myappApp').factory('Category', function($resource) {
  return $resource('http://localhost:3000/categories/:id', {}, {
    query: {
      method: 'GET',
      isArray:true,
      data: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    }
  });

});
