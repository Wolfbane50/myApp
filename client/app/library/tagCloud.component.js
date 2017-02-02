'use strict';

(function() {
  class TagCloudComponent {
  constructor($http) {
    this.$http = $http;

      this.tagCloud = null;
      this.tagMaxHits = 0;

      this.getTagThresholds = function(ctrl) {
        var sumHits = 0,
          maxHits = 0;
        angular.forEach(ctrl.tagCloud, function(tag) {
          maxHits = (tag.count > maxHits) ? tag.count : maxHits;
        });
        return maxHits;
      };

      this.tagFrequencyClass = function(tag) {
        var cssIncr;
        if (tag.count == 1) {
          cssIncr = 1;
        } else {
          var cssIncr = Math.ceil((Math.log(tag.count) / Math.log(this.tagMaxHits)) * 4);
        }
        //console.log("Tag: " + tag.name + " Count: " + tag.count + " Offset = " + cssIncr + ", maxHits = " + this.tagMaxHits);
        return "tagCss" + cssIncr;
      };
      this.select = function(document) {
        console.log("tagCloud.select called, passing through, doc => " + JSON.stringify(document));
        this.onSelect(document);
      };


  }  // end constructor

  $onInit() {
    console.log("In tagCloud Controller, about to get tagCloud");
    var ctrl = this;
    this.$http({
      method: 'GET',
//               url: 'http://localhost:3000/documents/tag_cloud',
      url: '/api/books/tag_cloud',
      headers: {
        'Accept': 'application/json'
      }
    }).then(function successCallback(response) {
      //alert("Got tag cloud");
      console.log("Got tagCloud => " + JSON.stringify(response.data));
      ctrl.tagCloud = response.data;
      ctrl.tagMaxHits = ctrl.getTagThresholds(ctrl);
    }, function errorCallback(response) {
      alert("Request for Tag Cloud yielded error: " + response.status);
    });
  } // end onInit
} // end component class

angular.module('myappApp')
  .component('tagCloudComponent', {
    bindings: {
      onSelect: '&'
    },
    templateUrl: 'app/library/tagCloud.html',
    controller: TagCloudComponent
  });

})();
