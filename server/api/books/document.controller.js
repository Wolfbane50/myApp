'use strict';
//var myRequest = require('request');
var restProxy = require('./proxy.controller');

var baseUrl = "http://localhost:3000/documents";
var proxy = new restProxy.Proxy(baseUrl);

export function query(req, res) {
  return proxy.query(req, res);
}

export function get(req, res) {
  return proxy.get(req, res);
}

export function create(req, res) {
  return proxy.create(req, res);
}

export function update(req, res) {
  return proxy.update(req, res);
}

export function del(req, res) {
  return proxy.del(req, res);
}
