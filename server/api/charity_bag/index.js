'use strict';

var express = require('express');
var controller = require('./charity_bag.controller');
//var passport = require('passport');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.get('/', function(req,res) {
  res.redirect(303, '/charity_bag');  // Send gets to the client app
});

router.post('/', controller.charity_bag);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
