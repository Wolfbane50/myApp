angular.module('myappApp').factory('Publisher', function($resource) {
  return $resource('http://localhost:3000/publishers.json', {}, {

  });

});
