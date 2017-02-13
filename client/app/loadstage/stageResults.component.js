'use strict';

(function() {
  class StageResultsComponent {
  constructor() {

    // define all functions
  }  // end constructor


} // end component class

angular.module('myappApp')
  .component('stageResults', {
    bindings: {
      result: '<'
    },
    templateUrl: 'app/loadstage/stageResults.html',
    controller: StageResultsComponent
  });

})();
