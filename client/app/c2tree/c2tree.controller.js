'use strict';

(function() {


  angular.module('myappApp')
    .controller('c2Ctrl', [ '$scope', '$http', function($scope, $http) {

      $scope.isCollapsed = true;
      $scope.showJSON = false;
      this.docs = [];

      this.selItem = {};
      var treeCtlScope = $scope;

      var c2DataStr = localStorage.getItem("c2portal");
      if (c2DataStr) {
          //alert("Getting data from local store");

             treeCtlScope.list = angular.fromJson(c2DataStr);
       } else {
            $http({ method: 'GET', url: 'c2snapshot.json', cache: true }).success(function(data) {
            //alert("Got data ");
                treeCtlScope.list = data;
            });
       }
       $scope.selectedItem = {};

       $scope.options = {};

       $scope.addingDoc = false;


       //=================================
       // Scope methods
       //=================================
       $scope.selectedItemClass = function(scope) {
           var nodeData = scope.$modelValue;
       	   if ($scope.selItem == nodeData) {
       		     return 'dhitem-selected';
       	   } else {
       		     return 'dhitem';
       	   }
       };

       $scope.itemIcon = function(scope) {
        	if (scope.hasChild()) {
       	  	return scope.collapsed ? 'glyphicon-folder-close' :'glyphicon-folder-open';
        	} else {
        		return 'glyphicon-file';
        	}
       };

       $scope.myCollapseAll = function() {
         $scope.$broadcast('angular-ui-tree:collapse-all');
       };
       $scope.myExpandAll = function() {
          $scope.$broadcast('angular-ui-tree:expand-all');
       };
       $scope.sureRemove = function(scope) {
     	   if (confirm("Are you sure you want to delete this node?")) {
     	      scope.remove();
        	}
       };

       $scope.toggle = function(scope) {
         scope.toggle();
       };

       $scope.newSubItem = function(scope) {
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

       $scope.itemSelect = function (scope) {
       	  $scope.selItem = scope.$modelValue;
       	  //alert("Selected item:  " + $scope.selItem.name);
       	  $scope.docs = $scope.selItem.docs;
       };

       $scope.docDown = function (docNum) {
   	     if (docNum == ($scope.docs.length - 1)) {
   		     return;
   	     }
   	     var tmpDoc = $scope.docs[docNum + 1];

      	 $scope.docs[docNum + 1] = $scope.docs[docNum];
       	 $scope.docs[docNum] = tmpDoc;

       };

       $scope.docUp = function (docnum) {
        	if (docnum == 0) {
        		return;
        	}
        	var tmpDoc = $scope.docs[docnum - 1];

        	$scope.docs[docnum - 1] = $scope.docs[docnum];
        	$scope.docs[docnum] = tmpDoc;

       };

       $scope.docDel = function (docnum) {
        	if (confirm("Are you sure you want to delete this document?")) {
        		$scope.docs.splice(docnum, 1);
        	}
       };

       $scope.docEdit = function (docNum) {
          	//alert("editing " + docNum);
          	$scope.editDoc = $scope.docs[docNum];
          	$scope.oldName = $scope.editDoc.name;
          	$scope.oldAuthor = $scope.editDoc.author;
          	$scope.oldDate = $scope.editDoc.date;
          	$scope.oldLink = $scope.editDoc.link;
       };

       $scope.docEditCancel = function() {
         	if ($scope.oldName) {
           	 $scope.editDoc.name = $scope.oldName;
           	 $scope.editDoc.author = $scope.oldAuthor;
           	 $scope.editDoc.date = $scope.oldDate;
           	 $scope.editDoc.link = $scope.oldLink;
         	}
         	$scope.editDoc = {};
         	$scope.addingDoc = false;
       };

       $scope.docEditOK = function() {
           if ($scope.addingDoc == true) {
            	if ($scope.docs) {
              	  // Some Validation would be nice here
              	  $scope.docs.push($scope.editDoc);
              	  $scope.addingDoc = false;
            	} else {
            	     $scope.selItem.docs = [ $scope.editDoc ];
            	}
           }
        	 $scope.editDoc = {};
       };

       $scope.docAdd = function() {
       	  $scope.addingDoc = true;
         	$scope.editDoc = {
         		name: " ",
         		author: "",
         		date: "",
         		link: ""
         	};
       };

       $scope.showJSONstuff = function() {
          	$scope.showJSON = true;
       };

       $scope.doneJSON = function() {
          	$scope.showJSON = false;
       };

       $scope.commitChanges = function() {
        	var c2String = angular.toJson($scope.list);
   	      localStorage.setItem("c2portal", c2String);
   	      alert("C2 Data saved to Local Storage");
       };

       $scope.flushLocal = function() {
   	      if (confirm("Are you really really sure you want to delete local storage?")) {
   		      localStorage.removeItem("c2portal");
   		      alert("Local Storage Deleted!");
   	      }
       };

       $scope.backup = function() {
               var c2String = angular.toJson($scope.list);

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


  }]);   // end controller

})();
