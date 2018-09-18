'use strict';

(function(){

class SpriteGridExampleComponent {
  constructor($http, $scope) {
    this.$http = $http;
    this.Doc = "";

    this.Featuring = "Adric, Nyssa";
    this.blah = "3rd, War";
    this.featureTable = [];
    this.doctorTable = [];
  }  // end constructor
  $onInit() {
      //console.log("spritespec.min.json BF Data");
      this.$http.get('spriteSpec.min.json', {
        cache: true
      }).then(response => {
        //console.log("Got response => " + JSON.stringify(response));
        this.featureTable = response.data.spriteTable;
        this.aliases = response.data.aliasMap;
      }, function errorCallback(response) {
          alert("Request for feature data yielded error: " + response.status);

      });
      this.$http.get('doctorSpriteSpec.min.json', {
        cache: true
      }).then(response => {
        //console.log("Got response => " + JSON.stringify(response));
        this.doctorTable = response.data.spriteTable;
      }, function errorCallback(response) {
          alert("Request for doctor data yielded error: " + response.status);

      });

    } // end of $onInit


}

angular.module('myappApp')
  .component('spriteGridExampleComponent', {
    templateUrl: 'app/spriteGridExample/spriteGridExample.html',
    controller: SpriteGridExampleComponent
  });

})();
