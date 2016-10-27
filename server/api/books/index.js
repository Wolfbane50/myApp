'use strict';

var express = require('express');
var controller = require('./books.controller');
//var restProxy = require('./proxy.controller');
//var categoryCtrl = new restProxy.Proxy("http://localhost:3000/categories");
//var documentCtrl = new restProxy.Proxy("http://localhost:3000/documents");
var publisherCtrl = require('./publisher.controller');
var categoryCtrl = require('./category.controller');
var documentCtrl = require('./document.controller');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.get('/', controller.query);
router.get('/loadstage', controller.loadstage);
router.get('/tag_cloud', controller.tagCloud);
router.get('/tag', controller.docsWithTag);
router.get('/tagsForDoc', controller.tagsForDoc);

// Categories
router.get('/categories', categoryCtrl.query);
router.get('/categories/:id', categoryCtrl.get); // Not really needed
router.post('/categories', categoryCtrl.create);
router.put('/categories/:id', categoryCtrl.update);
router.delete('/categories/:id', categoryCtrl.del);

// Documents
router.get('/documents', documentCtrl.query);
router.get('/documents/:id', documentCtrl.get);
router.post('/documents', documentCtrl.create);
router.put('/documents/:id', documentCtrl.update);
router.delete('/documents/:id', documentCtrl.del);

// Publishers
router.get('/publishers', publisherCtrl.query);
//router.get('/publishers/:id', publisherCtrl.get); // Not really needed
router.post('/publishers', publisherCtrl.create);
//router.put('/publishers/:id', publisherCtrl.update);
router.delete('/publishers/:id', publisherCtrl.del);
router.delete('/publishers', publisherCtrl.del);


module.exports = router;
