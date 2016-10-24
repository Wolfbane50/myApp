'use strict';
var myRequest = require('request');
var url;

function sendIt(opts, callback) {
  myRequest(opts, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
      callback(response, body);
    }

  });
}


exports.Proxy = function(url) {
  this.baseUrl = url;
  this.print = function() {
    console.log("My URL is " + url);
  }

  this.query = function(req, res) {
    var reqOptions = {
      url : ths.baseUrl,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    } ;
    sendIt(reqOptions, function(response, body) {
        res.set('Content-Type', 'application/json');
        res.status(response.statusCode).send(body);
    });

  };

  this.get = function(req, res) {
    var reqOptions = {
      url : this.baseUrl + '/' + req.params.id,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    } ;
    sendIt(reqOptions, function(response, body) {
        res.set('Content-Type', 'application/json');
        res.status(response.statusCode).send(body);
    });

  };

  this.create = function(req, res) {
    var reqOptions = {
      url : this.baseUrl,
      method: 'POST',
      json: true,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      body: req.body
    } ;
    sendIt(reqOptions, function(response, body) {
        res.set('Content-Type', 'application/json');
        res.status(response.statusCode).send(body);
    });

  };

  this.update = function(req, res) {
    var reqOptions = {
      url : this.baseUrl + '/' + req.params.id,
      method: 'PUT',
      json: true,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      },
      body: req.body
    } ;
    sendIt(reqOptions, function(response, body) {
        //res.set('Content-Type', 'application/json');
        res.status(response.statusCode).send();
    });
  };

  this.del = function(req, res) {
    var reqOptions = {
      url : this.baseUrl + '/' + req.params.id,
      method: 'DELETE',
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    } ;
    sendIt(reqOptions, function(response, body) {
        //res.set('Content-Type', 'application/json');
        console.log("Delete success with status " + response.status);
        res.status(response.statusCode).send();
    });

  };

};
