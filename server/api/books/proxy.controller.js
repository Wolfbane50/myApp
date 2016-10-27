'use strict';
var myRequest = require('request');


function sendIt(opts, res, callback) {
  myRequest(opts, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
      if(response.statusCode >= 400) {
        return res.status(response.statusCode).send(body);
      }
      callback(response, body);
    }

  });
}


exports.Proxy = function(url) {
  this.baseUrl = url;

  this.query = function(req, res) {
    console.log("Sending Get to " + this.baseUrl);

    var reqOptions = {
      url : this.baseUrl,
      headers: {
        'Content_Type': 'application/json',
        'Accept' : 'application/json'
      }
    } ;
    sendIt(reqOptions, res, function(response, body) {
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
    console.log("Sending Get to " + this.baseUrl + "for id=" + req.params.id);
    sendIt(reqOptions, res, function(response, body) {
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
    sendIt(reqOptions, res, function(response, body) {
       console.log("Create: Response Code = " + response.statusCode);
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
    sendIt(reqOptions, res, function(response, body) {
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
    sendIt(reqOptions, res, function(response, body) {
        //res.set('Content-Type', 'application/json');
        //console.log("Delete success with status " + response.statusCode);
        res.status(response.statusCode).send();
    });

  };

};
