'use strict';

(function() {
    class MyEpubComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        //this.bookUrl = "epub/Beginning.Android.3.epub";

        this.bookUrl = "epub/86e2n.B.epub";
        this.chapters = [];
        this.Book;
        this.loadingBook = true;
        this.selectedChapter = 0;
        //=================================
        // Scope methods
        //=================================
        this.changeBook = function() {
            console.log("Changing Book...");
            var newBookUrl = prompt("URL of epub to view_container: ");
            if (newBookUrl) {
              this.chapters = [];
              this.Book.destroy();
              this.bookUrl = newBookUrl;
              this.openBook(this.bookUrl);
            }

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
        this.openBook = function(url) {
          console.log("this.openBook => " + url);
          this.loadingBook = true;
          this.Book = ePub({
                    restore: true,
                    withCredentials: true
          //          layout: "pre-paginated"

                  });
                  this.Book.forceSingle();
          //this.bookUrl = "epub/Beginning.Android.3.epub";
          this.Book.open(url);

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
            }, function(error) {
              console.log("Book rendered error path")
              console.error(error);
            });

        };

      } // end constructor


      $onInit() {
        console.log("Instantiating Book");
//        this.Book = ePub(this.bookUrl, {
//          width: "400px",
//          height: "600px",
//          spreads: false,
        console.log("Calling openBook");
        this.openBook(this.bookUrl);

        } // end onInit
      } // end component class

      angular.module('myappApp')
        .component('myEpubComponent', {
          templateUrl: 'app/myEpub/myEpub.html',
          controller: MyEpubComponent
        });

    })();
