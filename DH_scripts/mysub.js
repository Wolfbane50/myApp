'use strict';
var url;

exports.Proxy = function(url) {
  this.url = url;
  this.print = function() {
    console.log("My URL is " + url);
  }
};
