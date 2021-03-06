'use strict';

var express = require('express');
var controller = require('./tunes.controller');

var router = express.Router();

//router.use(function(req, res, next){
//  console.log('Dh route: %s %s %s', req.method, req.url, req.path);
//  next();
//});
router.get('/',
   controller.index);
router.get('/search', controller.albumSearch);
router.post('/update', controller.updateTunes);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
