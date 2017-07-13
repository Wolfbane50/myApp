'use strict';

var express = require('express');
var controller = require('./gsynch.controller');
//var passport = require('passport');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.post('/', controller.update);

module.exports = router;
