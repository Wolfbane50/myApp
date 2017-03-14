'use strict';

(function() {

  class C2treeComponent {
    constructor($http, $scope, $uibModal) {
      this.$http = $http;
      this.isCollapsed = true;
      this.showJSON = false;
      this.docs = [];

      this.selItem = {};
      this.selectedItem = {};

       this.options = {};

      this.addingDoc = false;
      var treeCtlScope = $scope;
      //=================================
      // Scope methods
      //=================================
      this.transform = function() {
        var term = this.xformPath;
        if (term.match(/Documents/)) {
          var newPath = term.substr(term.indexOf('Documents') + 10);
          newPath = newPath.replace(/\\/g, '/');
          this.xformPath = "http://localhost:9000/" + newPath;
        }

      };

      this.selectedItemClass = function(scope) {
          var nodeData = scope.$modelValue;
          if (this.selItem == nodeData) {
              return 'dhitem-selected';
          } else {
              return 'dhitem';
          }
      };

    this.itemIcon = function(scope) {
         if (scope.hasChild()) {
           return scope.collapsed ? 'glyphicon-folder-close' :'glyphicon-folder-open';
         } else {
           return 'glyphicon-file';
         }
      };

    this.myCollapseAll = function() {
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };
      this.myExpandAll = function() {
         $scope.$broadcast('angular-ui-tree:expand-all');
      };
      this.sureRemove = function(scope) {
        if (confirm("Are you sure you want to delete this node?")) {
           scope.remove();
         }
      };

      this.toggle = function(scope) {
        scope.toggle();
      };

      this.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        if (nodeData.items == null) {
         nodeData.items = [];
        }

        var newName = prompt("Name of new item: ");
        nodeData.items.push({
          //id: nodeData.id * 10 + nodeData.items.length,
          id: new Date(),
          name: newName,
          docs: [],
          items: []
        });
      };

      this.itemSelect = function (scope) {
         this.selItem = scope.$modelValue;
         //alert("Selected item:  " + this.selItem.name);
         this.docs = this.selItem.docs;
      };

      this.docDown = function (docNum) {
        if (docNum == (this.docs.length - 1)) {
          return;
        }
        var tmpDoc = this.docs[docNum + 1];

        this.docs[docNum + 1] = this.docs[docNum];
        this.docs[docNum] = tmpDoc;

      };

    this.docUp = function (docnum) {
         if (docnum == 0) {
           return;
         }
         var tmpDoc = this.docs[docnum - 1];

         this.docs[docnum - 1] =things.docs[docnum];
         this.docs[docnum] = tmpDoc;

      };

    this.docDel = function (docnum) {
         if (confirm("Are you sure you want to delete this document?")) {
           this.docs.splice(docnum, 1);
         }
      };

    this.docEdit = function (docNum) {
           //alert("editing " + docNum);
           this.editDoc = this.docs[docNum];
           this.oldName = this.editDoc.name;
           this.oldAuthor = this.editDoc.author;
           this.oldDate = this.editDoc.date;
           this.oldLink = this.editDoc.link;
      };

      this.docEditCancel = function() {
         if (this.oldName) {
            this.editDoc.name = this.oldName;
            this.editDoc.author = this.oldAuthor;
            this.editDoc.date = this.oldDate;
            this.editDoc.link = this.oldLink;
         }
         this.editDoc = {};
         this.addingDoc = false;
      };

      this.docEditOK = function() {
          if (this.addingDoc == true) {
             if (this.docs) {
                 // Some Validation would be nice here
                 this.docs.push(this.editDoc);
                 this.addingDoc = false;
             } else {
                  this.selItem.docs = [ this.editDoc ];
             }
          }
          this.editDoc = {};
      };

      this.docAdd = function() {
         this.addingDoc = true;
         this.editDoc = {
           name: " ",
           author: "",
           date: "",
           link: ""
         };
      };

      this.showJSONstuff = function() {
           this.showJSON = true;
      };

      this.doneJSON = function() {
           this.showJSON = false;
      };

      this.commitChanges = function() {
         var c2String = angular.toJson(this.list);
         localStorage.setItem("c2portal", c2String);
         alert("C2 Data saved to Local Storage");
      };

      this.flushLocal = function() {
         if (confirm("Are you really really sure you want to delete local storage?")) {
           localStorage.removeItem("c2portal");
           alert("Local Storage Deleted!");
         }
      };

      this.backup = function() {
              var c2String = angular.toJson(this.list);

              $http({ method: 'POST', url: '/api/backups/',
                   data: { "c2_data" : c2String,
                           "bkfile" : "c2snapshot"
               } }).success(function(data) {
                   alert("Backup Successful!\n\n" + data);
               }).error(function(data, status, headers, config) {
                 // Handle the error
                    alert("Backup failed with status: " + status);
               });

      };

  } // end constructor
    $onInit() {
      //console.log("Ran onInit for c2tree component");
      var c2DataStr = localStorage.getItem("c2portal");
      if (c2DataStr) {
          //alert("Getting data from local store");

             this.list = angular.fromJson(c2DataStr);
       } else {
            this.$http.get('c2snapshot.json', {
              cache: true
            }).then(response => {
            //alert("Got c2 tree data ");
               this.list = response.data;
            }, function errorCallback(response) {
                alert("Request for C2 data yielded error: " + response.status);
            });
       }
    } // end onInit

  } // end class for component

  angular.module('myappApp')
    .component('c2treeComponent', {
      controller: C2treeComponent,
      // styleUrls: [ 'app/flexboxPlay/flexboxPlay.css' ],  Angular 2 feature
      templateUrl: 'app/c2tree/c2tree.html'
    });


})();
