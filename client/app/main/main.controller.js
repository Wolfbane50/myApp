'use strict';

(function() {

  class MainController {

    constructor($http, $scope, Modal, ngToast) {
        this.$http = $http;
        this.modal = Modal;

        this.makeToast = function(msg) {
          ngToast.create(msg);
        }

        this.clearToast = ngToast.dismiss;

        this.torNum = "";
        this.getTorNumber = function (url) {
          if (url.match(/yourbittorrent.com/)) {
            this.torNum = url.replace(/https:\/\/yourbittorrent.com\/torrent\//, "");
            this.torNum = torNum.replace(/\/.*$/, "");
            return this.torNum;
            //https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html
          }
        }



        // Example use of Modal Confirm dialog
        this.dummyConfirm = function() {
          console.log('in dummyConfirm');
          var myModalFn = this.modal.confirm.delete(function(data1, data2) {
            console.log('You are confirmed');
            console.log("Data1 = " + data1);
            console.log("Data2 = " + data2);
          });

          myModalFn("My Junk", "additional data", "more additional data");

        };
        this.content = { name: "none" }

      $scope.captureFile = function(ele) {
         var mainScope = this;
          var files = ele.files;
          if (files.length) {
            alert("Selected:\nPath: " + files[0].webkitRelativePath + "\nFile: " + files[0].name);
            var reader = new FileReader();
            reader.onload = function() {
              mainScope.content = JSON.parse(this.result);
              mainScope.$apply();
              alert("Loading content " + JSON.stringify(mainScope.content));
            };
            reader.readAsText(files[0]);
          } else {
            alert("No files selected!")
          }
        };

      }
      //    $scope.$on('$destroy', function() {
      //      socket.unsyncUpdates('thing');
      //      });
      //    }

    //$onInit() {
    //  this.$http.get('/api/things')
    //    .then(response => {
    //      this.awesomeThings = response.data;
    //      this.socket.syncUpdates('thing', this.awesomeThings);
    //    });
    //}

    //addThing() {
    //  if (this.newThing) {
    //    this.$http.post('/api/things', {
    //      name: this.newThing
    //    });
    //    this.newThing = '';
    //  }
    //}

    //  deleteThing(thing) {
    //    this.$http.delete('/api/things/' + thing._id);
    //  }
  }

  angular.module('myappApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'MnCtrl'
    });
})();
