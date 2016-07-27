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

// Some sample data for development purposes
var bags_data = {
    "bags" : 3,
    "charity" : "My Charity",
    "date" : "15 April 2015",
    "total" : "206.59",
    "items" : [ {
        "name" : "Dress ",
        "price" : "8.19"
    }, {
        "name" : "Blouse ",
        "price" : "5.58"
    }, {
        "name" : "Dress ",
        "price" : "11.94"
    }, {
        "name" : "Pants ",
        "price" : "8.63"
    }, {
        "name" : "Shirt ",
        "price" : "2.76"
    }, {
        "name" : "Shirt ",
        "price" : "3.85"
    }, {
        "name" : "Men's Shorts ",
        "price" : "3.11"
    }, {
        "name" : "Women's Blouse ",
        "price" : "3.21"
    }, {
        "name" : "Men's Slacks ",
        "price" : "9.72"
    }, {
        "name" : "Women's Slacks ",
        "price" : "7.42"
    }, {
        "name" : "Men's Shirt ",
        "price" : "9.13"
    }, {
        "name" : "Skirt ",
        "price" : "4.29"
    }, {
        "name" : "Slacks ",
        "price" : "7.03"
    }, {
        "name" : "Skirt ",
        "price" : "2.17"
    }, {
        "name" : "Dress ",
        "price" : "7.06"
    }, {
        "name" : "Slacks ",
        "price" : "5.80"
    }, {
        "name" : "Slacks ",
        "price" : "4.10"
    }, {
        "name" : "Skirt ",
        "price" : "3.66"
    }, {
        "name" : "Men's Shirt ",
        "price" : "2.31"
    }, {
        "name" : "Women's Blouse ",
        "price" : "9.71"
    }, {
        "name" : "Men's Shirt ",
        "price" : "2.75"
    }, {
        "name" : "Women's Slacks ",
        "price" : "3.61"
    }, {
        "name" : "Women's Sweater ",
        "price" : "7.27"
    }, {
        "name" : "Skirt ",
        "price" : "2.29"
    }, {
        "name" : "Jeans ",
        "price" : "7.55"
    }, {
        "name" : "Skirt ",
        "price" : "1.81"
    }, {
        "name" : "Pants ",
        "price" : "4.07"
    }, {
        "name" : "Pants ",
        "price" : "10.00"
    }, {
        "name" : "Pants ",
        "price" : "3.00"
    }, {
        "name" : "Skirt ",
        "price" : "4.58"
    }, {
        "name" : "Pants ",
        "price" : "4.94"
    }, {
        "name" : "Skirt ",
        "price" : "5.09"
    }, {
        "name" : "Women's Sweater ",
        "price" : "8.68"
    }, {
        "name" : "Men's Shorts ",
        "price" : "3.92"
    }, {
        "name" : "Men's Undershort ",
        "price" : "2.10"
    }, {
        "name" : "Men's Slacks ",
        "price" : "5.22"
    }, {
        "name" : "Men's Undershort ",
        "price" : "1.58"
    }, {
        "name" : "Men's Shirt ",
        "price" : "8.46"
    } ]
};

export function charity_bag(req, res) {
  console.log("-------------In Charity_bag server --");
  console.log("Request ==>\n" + JSON.stringify(req.body));

  var theTrips = {
    "trips": []
  };
  for (var i = 0; i < req.body.trips.length; i++) {
    console.log("Processing trip #" + i);
    var trip = req.body.trips[i];
    var man = ctrlCharBag.calculate(trip.charity, trip.date, trip.bags);
    console.log(JSON.stringify(man));
    theTrips.trips.push(man);
  }
    //console.log(JSON.stringify(theTrips));
  res.render('charity_report', theTrips);
}
