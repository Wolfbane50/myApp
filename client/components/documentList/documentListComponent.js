 'use strict';


 (function() {
   class DocumentListComponent {
     constructor($state) {
         this.$state = $state;
         this.select = function(doc) {
//           console.log("In documentList.select, doc => " + JSON.stringify(doc));
//           console.log("About to call state " + this.state);
           this.$state.go(this.state, doc);
           //this.onSelect(doc);
         };

//         this.$onChanges = function(changes) {
//           console.log("documentList onChanges event fired!");
           //  Replace current value in component
           // if (changes.docs) {
           //    this.docs = changes.docs.currentValue;
           // }
//         };
       } // end constructor

//     $onInit() {
//        console.log("documentList.onInit: selection state = " + this.state );
//         console.log("Initializing documentList => " + JSON.stringify(this.docs));
//         if (!this.onSelect) {
//           console.log("No onSelect callback set!");
//         }
//       } // end onInit
   } // end component class

   angular.module('myappApp')
     .component('documentList', {
       bindings: {
         docs: '<',
         state: '<',
         onSelect: '&'
       },
       templateUrl: 'components/documentList/documentList.html',
       controller: DocumentListComponent
     });

 })();
