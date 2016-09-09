angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gdriveIdTable', {
        url: '/gdriveIdTable',
        template: '<gdrive-id-table></gdrive-id-table>',
        css: 'app/gdriveIdTable/gdriveIdTable.css'
      });
  });
