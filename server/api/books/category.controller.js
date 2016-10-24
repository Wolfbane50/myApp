'use strict';
var myRequest = require('request');
var baseUrl = "http://localhost:3000/categories";

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
export function query(req, res) {
  var reqOptions = {
    url : baseUrl,
    headers: {
      'Content_Type': 'application/json',
      'Accept' : 'application/json'
    }
  } ;
  sendIt(reqOptions, function(response, body) {
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
  });
}

export function get(req, res) {
  var reqOptions = {
    url : baseUrl + '/' + req.params.id,
    headers: {
      'Content_Type': 'application/json',
      'Accept' : 'application/json'
    }
  } ;
  sendIt(reqOptions, function(response, body) {
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
  });

}

export function create(req, res) {
  console.log("Create will post " + JSON.stringify(req.body));
  var reqOptions = {
    url : baseUrl,
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


}

export function update(req, res) {
  var reqOptions = {
    url : baseUrl + '/' + req.params.id,
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


}

export function del(req, res) {
  var reqOptions = {
    url : baseUrl + '/' + req.params.id,
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


}
