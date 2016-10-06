angular.module('myappApp').factory('Category', function($resource) {
  return $resource('http://localhost:3000/categories/:id', {}, {
    query: {
      method: 'GET',
      isArray:true,
      data: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      xsrfCookieName: "_doc_mgr_session"
    },
    create: {
      method: 'POST',
      isArray: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      xsrfCookieName: "_doc_mgr_session"
    },
    update: {
      method: 'PUT',
      isArray: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      xsrfCookieName: "_doc_mgr_session"
    },
    delete: {
      method: 'DELETE',
      data: false,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      xsrfCookieName: "_doc_mgr_session"
    }

  });

});
