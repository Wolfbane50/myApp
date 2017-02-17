/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/backups              ->  index
 * POST    /api/backups              ->  create
 * GET     /api/backups/:id          ->  show
 * PUT     /api/backups/:id          ->  update
 * DELETE  /api/backups/:id          ->  destroy
 */

'use strict';
//import fs from 'fs';
var ctrlCharBag = require('./charity_bag_calc.js');
//import ctrlCharBag from './charity_bag_calc.js';

export function charity_bag(req, res) {
  //console.log("-------------In Charity_bag server --");
  //console.log("Request ==>\n" + JSON.stringify(req.body));

  var theTrips = {
    "trips": []
  };
  if (req.body.trips) {
    for (var i = 0; i < req.body.trips.length; i++) {
      //console.log("Processing trip #" + i);
      var trip = req.body.trips[i];
      var man = ctrlCharBag.calculate(trip.charity, trip.date, trip.bags);
      //console.log(JSON.stringify(man));
      theTrips.trips.push(man);
    }
  } else {
    console.log("No trips found in request body: " + JSON.stringify(req.body));
    return res.status(422).send("No charity trips defined in request")
  }
  //console.log(JSON.stringify(theTrips));
  if (req.body.wantJSON) {
    return res.json(theTrips);
  } else {
    return res.render('charity_report', theTrips);
  }
}
