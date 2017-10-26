'use strict';

(function() {
    class MyEpubComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.bookUrl = "epub/reader/moby-dick/";
        this.chapters = [];
        this.Book;
        this.loadingBook = true;
        //=================================
        // Scope methods
        //=================================
        this.changeBook = function() {

        }
        this.selectedClass = function(index) {}
        this.selectChapter = function(chapter, index) {}
      } // end constructor

      $onInit() {
        console.log("Instantiating Book");
        this.Book = ePub(this.bookUrl, {
          width: "500px",
          height: "500px"
        });

        console.log("Getting TOC");
        var ctrl = this;
        this.Book.getToc().then(function(toc) {
            console.log("Got TOC");
            ctrl.chapters = toc;
          });

          this.Book.ready.all.then(function() {
            console.log("Ready all...");
            ctrl.loadingBook = false;
            console.log("Ready all after set flag...");
          });

          this.Book.renderTo("epubarea").then(function() {
            console.log("Book rendered...");
          });
        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('myEpubComponent', {
          templateUrl: 'app/myEpub/myEpub.html',
          controller: MyEpubComponent
        });

    })();
