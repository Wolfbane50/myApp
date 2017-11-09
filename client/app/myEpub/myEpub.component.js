'use strict';

(function() {
    class MyEpubComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.bookUrl = "epub/reader/moby-dick/";
      //  this.bookUrl = "https://s3.amazonaws.com/moby-dick/";
        this.chapters = [];
        this.Book;
        this.loadingBook = true;
        this.selectedChapter = 0;
        //=================================
        // Scope methods
        //=================================
        this.changeBook = function() {
            console.log("Changing Book...");
        };
        this.selectedClass = function(index) {
          if (this.selectedChapter === index ) {
            return true;
          } else {
            return false;
          }
        };
        this.selectChapter = function(chapter, index) {
          this.selectedChapter = index;
          console.log("Selected chapter: " + JSON.stringify(chapter));
          this.Book.goto(chapter.cfi);
          //displayChapter(chapter, false);
        };

        this.whereAmI = function() {
          alert(this.Book.getCurrentLocationCfi());
        };

      } // end constructor


      $onInit() {
        console.log("Instantiating Book");
        this.Book = ePub(this.bookUrl, {
//          width: "400px",
//          height: "600px",
          spreads: false

        });

        console.log("Getting TOC");
        var ctrl = this;
        this.Book.getToc().then(function(toc) {
            console.log("Got TOC: " +  JSON.stringify(toc));
            ctrl.chapters = toc;
          });

          this.Book.ready.all.then(function() {
            console.log("Ready all...");
            ctrl.loadingBook = false;
            console.log("Ready all after set flag...");
          });


          this.Book.renderTo("epubarea").then(function() {
            console.log("Book rendered...");
          }, function(error) {
            console.log("Book rendered error path")
            console.error(error);
          });
        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('myEpubComponent', {
          templateUrl: 'app/myEpub/myEpub.html',
          controller: MyEpubComponent
        });

    })();
