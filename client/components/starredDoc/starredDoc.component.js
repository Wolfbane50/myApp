'use strict';

(function() {
  class StarredDocComponent {
    constructor() {

      this.toggle = function() {
        this.starred = !(this.starred);
        this.onStarToggle({ document: this.doc, toValue: this.starred });
      };



      this.starredIcon = function() {
        return (this.starred) ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty';
      };

      this.saveCB = function(document) {
        this.onSave({ document: document });
      };
      this.deleteCB = function(document) {
        this.onDelete({ document: document });
      };
      this.categoryChangeCB = function(old, chg, document) {
        this.onCategoryChange({ old: old, chg: chg, document: document });
      };

    } // end constructor


          $onInit() {
              // Handle Options
                      console.log("In onInit of starredDoc, starred = " + this.starred + " doc = " + JSON.stringify(this.doc));
            } // end onInit
        } // end component class

        angular.module('myappApp')
          .component('starredDoc', {
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
            templateUrl: 'components/starredDoc/starredDoc.html',
            controller: StarredDocComponent
          });

      })();
