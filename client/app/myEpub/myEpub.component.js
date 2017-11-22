'use strict';

(function() {
    class MyEpubComponent {
      constructor($http, $state, $scope) {
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        //this.bookUrl = "epub/Beginning.Android.3.epub";

        this.chapters = [];
        this.Book;
        this.loadingBook = true;
        this.selectedChapter = 0;

        this.catalog = [{
          name: "Brew It Yourself",
          url: "/epub/86e2n.B.epub"
        }, {
          name: "Angular.JS:  Novice to Ninja",
          url: "/epub/angularjs_novice_to_ninja.epub"
        }, {
          name: "Beginning Android 3",
          url: "/epub/Beginning.Android.3.epub"
        }, {
          name: "Beeing Geek",
          url: "/epub/Being_Geek.epub"
        }, {
          name: "Elgin Baylor Biography",
          url: "/epub/Elgin_Baylor__The_Man_Who_Changed_Basketball__Bijan_C._Bayne.epub"
        }, {
          name: "Emotional Agility",
          url: "/epub/Emotional Agility_ Get Unstuck, Embrace Change and Thrive in Work and Life (2016).epub"
        }, {
          name: "Essential Oils",
          url: "/epub/Essential Oils - Abigail Cruise.epub"
        }, {
          name: "Getting MEAN",
          url: "/epub/getting-mean-with-mongo-express-angular-and-node.epub"
        }, {
          name: "Hacking VoIP",
          url: "/epub/Hacking VoIP.epub"
        }, {
          name: "John Adams Biography",
          url: "/epub/John Adams - David McCullough.epub"
        }, {
          name: "OpenSSL Cookbook",
          url: "/epub/OpenSSL Cookbook.epub"
        }, {
          name: "The Mindful Geek",
          url: "/epub/The Mindful Geek.epub"
        }, {
          name: "Social Media Job Search",
          url: "/epub/The Social Media Job Search Workbook.epub"
        }];
        this.currentBook = this.catalog[0];
        this.bookUrl = this.currentBook.url;
        //=================================
        // Scope methods
        //=================================
        // Select book from select form input
        this.bookSelect = function(index) {
          console.log("Selected book is " +  this.currentBook.name);
          if (this.currentBook.url !== this.bookUrl) {
              this.swapBook(this.currentBook.url);
            }
        };
        this.swapBook = function(newBookUrl) {
          this.chapters = [];
          this.Book.destroy();
          this.bookUrl = newBookUrl;
          this.openBook(this.bookUrl);

        };
        this.changeBook = function() {
            console.log("Changing Book...");
            var newBookUrl = prompt("URL of epub to view_container: ");
            if (newBookUrl) {
              this.swapBook(newBookUrl);
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
              ctrl.selectedChapter = 0;
              ctrl.chapters = toc;
              ctrl.$scope.$apply();
            });

            this.Book.ready.all.then(function() {
              console.log("Ready all...");
              ctrl.loadingBook = false;
              console.log("Ready all after set flag...");
            });


            this.Book.renderTo("epubarea").then(function() {
              console.log("Book rendered...");
            }, function(error) {
              console.log("Book rendered error path");
              console.error(error);
            });

        };
        this.$onChanges = function(changes) {
          console.log("In $onChanges");
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
