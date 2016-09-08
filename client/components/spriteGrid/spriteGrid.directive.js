'use strict';

angular.module('spriteGrids')
  .directive('dhSpriteSet', ['spriteGrid', function(spriteGrid) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        featureString: '=feat',
        // 	  	configUrl     : '=config',
        dhFloat: '=?'
      },
      controller: function($scope, $element, $attrs, $transclude) {
        //console.log("dhSpriteSet Controller... configUrl = " + $attrs.config);
        $scope.configUrl = $attrs.config;
        this.getSpriteStyle = function(peep) {

          //  Check if configuration exists yet
          var featureStyle;
          if ($scope.spriteObj.getSpriteFile()) {

            // console.log("Showing image");
            var urlStr = "url(" + $scope.spriteObj.getSpriteFile() + ")";
            featureStyle = {
              "background-image": urlStr,
              "background-position": $scope.spriteObj.getOffsets(peep),
              "width": $scope.spriteObj.getSpriteWidth(),
              "height": $scope.spriteObj.getSpriteHeight(),
              "float": $scope.float

            };
          } else {
            // Make a box when configuration isn't ready
            //console.log("Showing a box");
            featureStyle = {
              "background-color": "DARKGRAY",
              "width": "32px",
              "height": "32px",
              "float": $scope.float
            };
          }
          return featureStyle;

        }
      },
      link: function(scope, element) {
        // console.log("Link for dhSpriteSet ... configUrl" + scope.configUrl);

        scope.featuring = [];
        scope.float = (scope.dhFloat) ? scope.dhFloat : "right";

        scope.updatePeeps = function() {
          //console.log("Update Peeps ...to " + scope.featureString);
          if (scope.featureString) {
            scope.featuring = scope.featureString.split(",");
            for (var i = 0; i < scope.featuring.length; i++) {
              scope.featuring[i] = scope.featuring[i].trim();
            }
          } else {
            scope.featuring = [];
          }

        };
        scope.cfgLoaded = false;
        scope.spriteObj = spriteGrid.generate(scope.configUrl, function() {
          //console.log("Configuration has been loaded");
          scope.$broadcast("configComplete")
        });



        scope.$watch('featureString', scope.updatePeeps);
        scope.templateStr = "<div ng-repeat=\"peep in featuring\"><div dh-peep peep='peep' dhfloat=\"left\"></div></div>";


      },
      // Problem:  Needt to pass float from directive to directive
      //template: "<div ng-repeat=\"peep in featuring\"><div dh-peep peep='peep' dhfloat=\"{{dhFloat}}\"></div></div>"
      template: "<div ng-repeat=\"peep in featuring\"><div dh-peep peep='peep'></div></div>"

    };

  }]);

angular.module('spriteGrids')
  .directive('dhPeep', [function() {

    return {
      retrict: 'EA',
      replace: false,
      require: '^?dhSpriteSet',
      scope: {
        peep: '='
      },
      //controller: function ($scope, $element,  $attrs, $transclude) {
      // 	console.log("dhPeep Controller... peep = " + $scope.peep);
      //},
      link: function(scope, element, attrs, dhSpriteSetController) {
        //console.log("FeatureStyle = " + angular.toJson(featureStyle, true));
        scope.element = element;
        scope.spriteObj = dhSpriteSetController.spriteObj;
        scope.gtStyle = dhSpriteSetController.getSpriteStyle;
        element.css(dhSpriteSetController.getSpriteStyle(scope.peep));
        scope.$on("configComplete", function() {
          scope.element.css(scope.gtStyle(scope.peep));

        });

      }
    };
  }]);
