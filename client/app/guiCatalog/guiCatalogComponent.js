'use strict';

(function() {

  class GuiCatalogComponent {
    constructor($http, $scope) {
      this.$http = $http;
      this.$scope = $scope;

      this.showJSON = false;
      this.prePath = "";
      this.catalog = {};
      this.pathMap = {
        "AEGIS B/L 9" : "",
        "LCS" : "LCS",
        "SSDS" : "SSDS",
        "ASTAC" : "ACB16/ASTAC_HSI",
        "Frigate Scratch" : "Frigate"
      };
      this.pathOptions = Object.keys(this.pathMap);
      this.pathOption = this.pathOptions[0];
      this.loadingData = true;

      // methods
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
        if (nodeData.children == null) {
         nodeData.items = [];
        }

        var newName = prompt("Name of new item: ");
        nodeData.children.push({
          //id: nodeData.id * 10 + nodeData.items.length,
          fig_num: '',
          number: '',
          text: newName,
          image: ''
        });
      };

      this.itemSelect = function (scope) {
        if (scope.hasChild()) {
          this.selItem = scope.$modelValue;
          this.showShow = false;
          return;
        }

        // this.listIndex points to where we are in the current branch of items
        this.listIndex = scope.index();
        // this.list points to the list of items or within a tree branch
        this.list = scope.$parentNodeScope.$modelValue.children;
        //console.log("Setting list to => " + angular.toJson(this.list));
        this.showShow = true;
         this.selItem = scope.$modelValue;
         //alert("Selected item:  " + this.selItem.name);
      };
      this.prevGUI = function() {
        if (this.listIndex == 0) {
          this.listIndex = this.list.length - 1;
        } else {
          this.listIndex--;
        }
        //console.log("Viewing GUI " + this.listIndex + " of " + this.list.length);
        this.selItem = this.list[this.listIndex];

      };
      this.nextGUI = function() {

                if (this.listIndex == (this.list.length - 1)) {
                  this.listIndex = 0;
                } else {
                  this.listIndex++;
                }
                //console.log("Viewing GUI " + this.listIndex + " of " + this.list.length);

                this.selItem = this.list[this.listIndex];

      };

      this.canAdd = function(scope) {
        return scope.hasChild();
      };


      this.guiAdd = function () {
        console.log("In guiAdd");
      };
      this.showJSONstuff = function() {
           this.showJSON = true;
      };

      this.doneJSON = function() {
           this.showJSON = false;
      };
      this.commitChanges = function () {
        console.log("In commitChanges");
      };

      this.mydocsToUrl = function(ele) {
         var mainScope = this;
          var files = ele.files;
          if (files.length) {
            console.log("Selected File record: " + JSON.stringify(files[0]));
            alert("Selected:\nPath: " + files[0].webkitRelativePath + "\nFile: " + files[0].name);
            //var reader = new FileReader();
            //reader.onload = function() {
            //  mainScope.content = JSON.parse(this.result);
            //  mainScope.$apply();
            //  alert("Loading content " + JSON.stringify(mainScope.content));
            //};
            //reader.readAsText(files[0]);
          } else {
            alert("No files selected!")
          }
        };

      this.changeGuiSet =function () {
        this.prePath = this.pathMap[this.pathOption];
        this.getGuiMetadata();
      };

        this.getGuiMetadata = function() {
          var ctrl = this;
          this.loadingData = true;
          this.catalog = null;
          this.$http.get(this.prePath + '/' + 'gui_review.json', {
            cache: true
          }).then(response => {
            //alert("Got c2 tree data ");
            ctrl.catalog = response.data;
            this.loadingData = false;
            this.selItem = null;
          }, function errorCallback(response) {
            alert("Request for GUI Catalog data returned error: " + response.status);
          });

        };

    } // end constructor
    $onInit() {
        //console.log("Ran onInit for c2tree component");
        this.prePath = this.pathMap[this.pathOption];
        this.getGuiMetadata();
      } // end onInit

  } // end class for component

  angular.module('myappApp')
    .component('guiCatalogComponent', {
      controller: GuiCatalogComponent,
      // styleUrls: [ 'app/flexboxPlay/flexboxPlay.css' ],  Angular 2 feature
      templateUrl: 'app/guiCatalog/guiCatalog.html'
    });


})();
