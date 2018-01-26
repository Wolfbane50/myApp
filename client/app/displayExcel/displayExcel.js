angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('displayExcel', {
        url: '/display-excel',
        component: 'displayExcelComponent'
      });
  });
