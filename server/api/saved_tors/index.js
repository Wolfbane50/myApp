'use strict';

var express = require('express');
var controller = require('./saved_tors.controller');
//var passport = require('passport');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.get('/',
   controller.getTorrents);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
