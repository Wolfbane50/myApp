 'use strict';


 (function() {
   class DocumentListComponent {
     constructor($state, $window) {
         this.$state = $state;
         this.$window = $window;
         this.myCounter = 0;
         this.select = function(doc, index) {

           console.log("In documentList.select, doc => " + JSON.stringify(doc));
           console.log("About to call state " + this.state);
           for (var i = 0; i < this.selectionTracker.length; i++) {
             this.selectionTracker[i] = false;
           }
           this.selectionTracker[index] = true;
           this.onSelect({ index: index });

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
         //  Set class on selected
         this.selectedClass = function(index) {
           if (this.selectionTracker) {
             return {
               userselected: this.selectionTracker[index]
             };
           } else {
             return { userselected: false };
           }
         };
         this.$onChanges = function(changes) {
           //console.log("documentList onChanges event fired!");
           //           console.log("documentList.onChanges event fired.  options = " + JSON.stringify(this.options));
           //  Replace current value in component
           // if (changes.docs) {
           //    this.docs = changes.docs.currentValue;
           // }
           if (this.docs) {
             this.selectionTracker = [];
             for (var i = 0; i < this.docs.length; i++) {
               this.selectionTracker.push(false);
             }
           } else {
             //console.log("no docs at this time");
           }
         };
       } // end constructor

     $onInit() {
         this.showDelete = false;
         if ((this.options) && (this.options.showDelete)) {
           this.showDelete = true;
         }
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
         options: '<',
         onSelect: '&',
         onRemove: '&'
       },
       templateUrl: 'components/documentList/documentList2.html',
       controller: DocumentListComponent
     });

 })();
