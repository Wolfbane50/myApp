/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
var express = require('express');

export default function(app) {
  // Insert routes below
  app.use('/api/backups', require('./api/backup'));
  app.use('/api/charity_bag', require('./api/charity_bag'));
  app.use('/api/ids', require('./api/ids'));
  app.use('/api/newCards', require('./api/newCards'));
  app.use('/api/parse_sps', require('./api/parseSPS'));
  app.use('/api/tier_ver', require('./api/tier_ver'));
  app.use('/api/tunes', require('./api/tunes'));
  app.use('/api/books', require('./api/books'));
  app.use('/api/gsynch', require('./api/gsynch'));
  app.use('/api/excel2json', require('./api/excel2json'));
  app.use('/api/doit', require('./api/doit'));
  app.use('/api/tiddly', require('./api/tiddly'));
  app.use('/epub', express.static(__dirname + '/epub'));
app.use(express.static('/Users/daniel.heaney/Documents'));
//  app.use('/api/things', require('./api/thing'));
//  app.use('/api/users', require('./api/user'));

app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
