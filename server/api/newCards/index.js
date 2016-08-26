'use strict';

var express = require('express');
var controller = require('./newCards.controller');
var chachiCtrl = require('./chachi.controller')
var buntCtrl = require('./buntCards.controller')
var passport = require('passport');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.get('/', controller.index);
router.post('/', controller.update);
router.get('/bunt', buntCtrl.index);
router.get('/drive', buntCtrl.getIds);
router.post('/bunt', buntCtrl.update);
router.get('/chachi', chachiCtrl.index);
router.post('/chachi', chachiCtrl.update);

module.exports = router;
