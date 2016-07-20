/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/backups              ->  index
 * POST    /api/backups              ->  create
 * GET     /api/backups/:id          ->  show
 * PUT     /api/backups/:id          ->  update
 * DELETE  /api/backups/:id          ->  destroy
 */

'use strict';
import fs from 'fs';

import _ from 'lodash';

function fileDateString () {
    // Return string in format of _mmddyy
    var dt = new Date();
    var month = dt.getMonth() + 1;
    var monthstr = ( month < 10 ) ? ("0" + month) : month;
    var day = dt.getDate();
    var daystr = ( day < 10 ) ? ("0" + day) : day;
    var year = dt.getFullYear() % 100;

    return "_" + monthstr + daystr + year;

}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


export function backup(req, res) {
  console.log("-------------In Backup--");
  console.log("backup file  = " + req.body.bkfile + fileDateString() + '.json' );
  // console.log("C2 String = " + req.body.c2_data);
  // Lets just assume the save works
  var ch_fname = "./" + req.body.bkfile + fileDateString() + '.json'
   fs.writeFile(ch_fname,
           req.body.c2_data);
  res.status(200).send("Data backed up to " + ch_fname);

}
