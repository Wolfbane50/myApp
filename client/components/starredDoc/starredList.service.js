'use strict';


angular.module('myappApp')
  .service('StarredListService', function() {
    var starredHash = {};
    var onChangeCB = null;
    return {
      init: function(config, onChange) {
        if (config.starredIds) {
          for (var i=0; i<config.starredIds.length; i++) {
            starredHash[config.starredIds[i]] = true;
          }
        }
        if(onChange) {
          onChangeCB = onChange;
        }
      },
      isStarred: function(id) {
        return (starredHash[id]) ? true : false;
      },
      list: function() {
        return Object.keys(starredHash);
      },
      toggle: function(id) {
        if (starredHash[id]) {
          delete starredHash[id];
        } else {
          starredHash[id] = true;
        }
        if(onChangeCB) onChangeCB();
      },
      clearAll: function() {
        starredHash = {};
        if(onChangeCB) onChangeCB();
      }
    };
   });
