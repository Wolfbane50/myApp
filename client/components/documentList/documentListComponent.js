 'use strict';


 (function() {
   class DocumentListComponent {
     constructor($state, $window) {
         this.$state = $state;
         this.$window = $window;
         this.myCounter = 0;
         this.showDelete = false;

         function clearSelections(ctrl) {
           for (var i = 0; i < ctrl.selectionTracker.length; i++) {
             ctrl.selectionTracker[i] = false;
           }
         }

         this.select = function(doc, index) {

           //console.log("In documentList.select, doc => " + JSON.stringify(doc));
           //console.log("About to call state " + this.state);
           clearSelections(this);
           this.selectionTracker[index] = true;
           this.onSelect({
             index: index
           });

           this.$state.go(this.state, doc);
           //this.onSelect(doc);
         };
         this.removeDoc = function(index) {
           // documentList doesnt own the data, so just pass it out
           var docToDel = this.docs[index];

           if (this.$window.confirm("Are you sure you want to delete this document?\n\n" + docToDel.title)) {
             this.onRemove({
               document: docToDel,
               index: index
             });
           }
         };
         this.selectFromIndex = function(index) {
           if (index >= 0) {
             var document = this.docs[index];
             this.select({ document: document }, index);
           } else {
             // Reset selection
             clearSelections(this);
           }
         };


         //  Set class on selected
         this.selectedClass = function(index) {
           if (this.selectionTracker) {
             return {
               userselected: this.selectionTracker[index]
             };
           } else {
             return {
               userselected: false
             };
           }
         };

         function processOptions(ctrl) {
           ctrl.showDelete = false;
           if ((ctrl.options) && (ctrl.options.showDelete)) {
             ctrl.showDelete = true;
           }

         }

         this.$onChanges = function(changes) {
           console.log("documentList onChanges event fired! changes => " + Object.keys(changes));
           //           console.log("documentList.onChanges event fired.  options = " + JSON.stringify(this.options));

           // Dont expect the state to ever change.
           if (changes.options) processOptions(this);
           if (changes.docs) {
             if (this.docs) {
               this.selectionTracker = [];
               console.log("Initializing selection tracker");
               for (var i = 0; i < this.docs.length; i++) {
                 this.selectionTracker.push(false);
               }
             } else {
               console.log("no docs at this time");
             }
           }
           if(changes.selectIndex) {
             console.log("Changes: => " + JSON.stringify(changes));
             console.log("selectIndex => " + JSON.stringify(this.selectIndex));
             this.selectFromIndex(this.selectIndex);
           }
         };
       } // end constructor

     $onInit() {
         //        console.log("documentList.onInit: selection state = " + this.state );
         //         console.log("Initializing documentList => " + JSON.stringify(this.docs));
         //           console.log("documentList.onInit: options = " + JSON.stringify(this.options));

       } // end onInit
   } // end component class

   angular.module('myappApp')
     .component('documentList', {
       bindings: {
         docs: '<',
         state: '<',
         selectIndex: '<',
         options: '<',
         onSelect: '&',
         onRemove: '&'
       },
       templateUrl: 'components/documentList/documentList2.html',
       controller: DocumentListComponent
     });

 })();
