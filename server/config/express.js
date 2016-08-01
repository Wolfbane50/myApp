/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
//import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
//import connectMongo from 'connect-mongo';
//import mongoose from 'mongoose';
//var MongoStore = connectMongo(session);

export default function(app) {
  var env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }

  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(config.root + '/server/public'));
  app.use(express.static('/Users/daniel.heaney/Documents/ADS_GUI_page'));
  app.use(express.static(app.get('appPath')));

  app.use(morgan(':method :url :req[header]', {
    immediate: true
  }));

  app.set('views', config.root + '/server/views');
  var handlebars = require('express-handlebars')
          .create();
  app.engine('handlebars', handlebars.engine);
  app.set('view engine', 'handlebars');
//  app.engine('html', require('ejs').renderFile);
//  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());
  app.use(cookieParser());
//  app.use(passport.initialize());

  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  //app.use(session({
  //  secret: config.secrets.session,
  //  saveUninitialized: true,
  //  resave: false,
  //  store: new MongoStore({
  //    mongooseConnection: mongoose.connection,
  //    db: 'myapp'
  //  })
//  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
//  if (env !== 'test' && !process.env.SAUCE_USERNAME) {
  //  app.use(lusca({
//      csrf: {
//        angular: true
//      },
//      xframe: 'SAMEORIGIN',
//      hsts: {
//        maxAge: 31536000, //1 year, in seconds
//        includeSubDomains: true,
//        preload: true
//      },
//      xssProtection: true
//  }

  if ('development' === env) {
    app.use(require('connect-livereload')({
      ignore: [
        /^\/api\/(.*)/,
        /\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/,
        /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/
      ]
    }));
  }

  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
