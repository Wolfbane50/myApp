 'use strict';


 (function() {
   class DocumentListComponent {
     constructor($state, $window) {
         this.$state = $state;
         this.$window = $window;
         this.select = function(doc) {
           console.log("In documentList.select, doc => " + JSON.stringify(doc));
           console.log("About to call state " + this.state);
           this.$state.go(this.state, doc);
           //this.onSelect(doc);
         };
        this.removeDoc = function(index) {
            // documentList doesnt own the data, so just pass it out
            var docToDel = this.docs[index];

            if (this.$window.confirm("Are you sure you want to delete this document?\n\n" + docToDel.title)) {
              this.onRemove({ document: docToDel, index: index });
          }
        };
//         this.$onChanges = function(changes) {
//           console.log("documentList onChanges event fired!");
//           console.log("documentList.onChanges event fired.  options = " + JSON.stringify(this.options));
           //  Replace current value in component
           // if (changes.docs) {
           //    this.docs = changes.docs.currentValue;
           // }
//         };
       } // end constructor

     $onInit() {
//        console.log("documentList.onInit: selection state = " + this.state );
//         console.log("Initializing documentList => " + JSON.stringify(this.docs));
//           console.log("documentList.onInit: options = " + JSON.stringify(this.options));
           if (this.options.showDelete) {
             this.showDelete = true;
           } else {
             this.showDelete = false;
           }
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
       templateUrl: 'components/documentList/documentList.html',
       controller: DocumentListComponent
     });

 })();
