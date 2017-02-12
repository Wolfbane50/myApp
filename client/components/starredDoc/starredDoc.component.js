'use strict';

(function() {
  class StarredDocComponent {
    constructor() {
      this.starred = false; // false by default
      this.doc = {};

      this.toggle = function() {
        this.starred = !(this.starred);
        this.onStarToggle(this.doc);
      };



      this.starredIcon = function() {
        return (this.starred) ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty';
      };

    } // end constructor


          $onInit() {
              // Handle Options
                      console.log("In onInit of starredDoc, starred = " + this.starred + " doc = " + JSON.stringify(this.doc));
            } // end onInit
        } // end component class

        angular.module('myappApp')
          .component('libdoc', {
            bindings: {
              // one-way input binding, e.g.,
              // <libdoc id="$parentCtrl.docid"></foo>
              // automatically bound to `docid` on the controller
              doc: '<', // Pointer to document record
              id: '<', // Pointer to id of document, must retrieve data
              starred: '<',
              options: '<', // Options object
              onCategoryChange: '&', // Callback for category change
              onSave: '&',
              onDelete: '&',
              onStarToggle: '&'
            },
            templateUrl: 'components/StarredDoc/starredDoc.html',
            controller: StarredDocComponent
          });

      })();
