'use strict';

function spriteGridService($http) {

  var validateFillPadVectors = function (vector, pad, tableLength, type) {

    if (vector.length) {
      if (vector.length < tableLength) {
          throw type + " Padding vector too short for Sprite Table. Expecting " 
                   + tableLength + " but got " + vector.length ;
       }
    } else {
      if (! pad) {
         pad = 0;
      }
      for (var i= 0; i < tableLength; i++) {
        vector[i] = pad;
      }
    }

  };
  var getFeaturing = function (config) {
     var featOffsets = {};

   // Validations and options in config file
   //     image height and width are mandatory
     if ((! config.imageHeight) || (! config.imageWidth)) {
        throw "imageHeight and imageWidth must be defined!";
     }

     config.topMargin = !!config.topMargin ? config.topMargin : 0;
     config.leftMargin = !!config.leftMargin ? config.leftMargin : 0;

     config.spacingUnits = !!config.spacingUnits ? config.spacingUnits : 'pixels';
     //  could validate for px, in, em, etc.

     // Validate length of vertical padding vector in case rows added without offsets
     validateFillPadVectors(config.vertPadVector, config.vertPad, config.spriteTable.length, "Vertical");

     var runningVertOffset = config.leftMargin;

     for (var i=0; i < config.spriteTable.length; i++) {
       var row = config.spriteTable[i];

       validateFillPadVectors(config.horizPadVector, config.horizPad, row.length, "Horizontal");

       runningVertOffset = runningVertOffset + config.vertPadVector[i]
       var runningHorOffset = config.topMargin;
       for (var j=0; j < row.length; j++) {
          runningHorOffset = runningHorOffset + config.horizPadVector[j];
          var peep = row[j];

          featOffsets[peep] = "-" + runningHorOffset + "px -" + runningVertOffset + "px";

          runningHorOffset = runningHorOffset + config.imageWidth;
       }
       runningVertOffset = runningVertOffset + config.imageHeight;
    }

   // Handle aliases
    angular.forEach(config.aliasMap, function(value, key) {
        var offset = featOffsets[value];
        if (offset) {
           featOffsets[key] = offset;
         } else {
           throw "Alias not found - " + key + " --> " + value;
         }
    });
    return featOffsets;
 };

 var processConfig = function(url, spriteConfig, callbacks) {


     $http({ method: 'GET', url: url, cache: true }).then(function(result) {
                //console.log("Got data from spriteSpec.json");

                // process result
                var myData = result.data
                spriteConfig.spriteFile = myData.spriteFile;
                spriteConfig.imageHeight = myData.imageHeight + myData.spacingUnits;
                spriteConfig.imageWidth = myData.imageWidth + myData.spacingUnits;
                spriteConfig.offsetMap = getFeaturing(myData);
                angular.forEach(callbacks, function(callback, index) {
                    //console.log("Making callback no. " + index + " for " + url);

                    callback();
                });
           }, function (response) {

             var msg = "Could not get Sprite configuration file (" + url +") : " + response.message;
             alert(msg);
              throw msg;
            });

    };

    var setConfigs = {};   // Allows offsets to be computed once, even if used in multiple instances
    var callbackHash = {}; // Contains all the config complete callbacks for a configuration
    return {
        "generate" : function (configUrl, callback) {
            //console.log("In generate... URL = " + configUrl);
            var spriteConfig;
            if ( setConfigs[configUrl] ) {
               // Reusing the configuration for the input url
                spriteConfig = setConfigs[configUrl];
                var callbacks = callbackHash[configUrl];
                callbacks.push(callback);

            } else {
              // Create new configuration
               spriteConfig = {};
               callbackHash[configUrl] = [ callback ];
               setConfigs[configUrl] = spriteConfig;   // Store the configuration
               processConfig(configUrl, spriteConfig, callbackHash[configUrl]);
            }

            return {
                config: spriteConfig,
                getOffsets : function(peep) {
                   //console.log("Get offset for " + peep);
                   if (this.config.offsetMap) {
                       var offset = this.config.offsetMap[peep];

                 // If no match, try 'Unknown'
                       offset = !!offset ? offset : this.config.offsetMap['Unknown'];
                       return offset;
                   } else {
                      //console.log("Race condition - sprite configuration not loaded yet");
                      // $http hasn't returned yet, return empty string.  Callback will update value
                      //    once we get a return
                      return "";
                   }
                },
                getSpriteFile : function () { return this.config.spriteFile; },
                getSpriteWidth : function () { return this.config.imageWidth; },
                getSpriteHeight : function () { return this.config.imageHeight; }

            };
        }   // end of generate definition
      };  // object returned from factory
} // end factory function


angular.module('spriteGrids')
        .factory('spriteGrid', [ '$http', spriteGridService ]);
