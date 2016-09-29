'use strict';
var google = require('googleapis');
var myGoogle = require('../../config/myGoogleApiCfg');
var encodeUrl = require('encodeurl');
import config from '../../config/environment';

export function query(req, res) {
  myGoogle.authThenProcess(req, res, bookQuery)
}

function sanitize(interm) {
    var term = interm.replace(/ /g, '+');
     term = term.replace(/:/g, '');
     term = term.replace(/\-/g, '');
     term = term.replace(/\./g, '');
     return encodeUrl(term);

}

function bookQuery(auth, req, res) {

   var theQuery = "";
   if(req.query.title) {

     theQuery = sanitize(req.query.title);

     //theQuery = theQuery + encodeUrl(req.query.title);
    // theQuery = encodeURIComponentl(req.query.title);
   }
   if (req.query.author) {
//     if (theQuery) { theQuery = theQuery + "+"; }
     theQuery = theQuery + "+inauthor:" + sanitize(req.query.author);
//     theQuery = theQuery + "inauthor:" + encodeUrl(req.query.author);
   }
   if (req.query.publisher) {
//     if (theQuery) { theQuery = theQuery + "+"; }
//     theQuery = theQuery + "inpublisher:" + req.query.publisher.replace('/ /', '+');
//     theQuery = theQuery + "inpublisher:" + encodeUrl(req.query.publisher);
   }
console.log("Query String: " + theQuery);
   // Should not send if there is no query
   if (theQuery == "") {
      console.log("No Query terms for Google Book search!")
      return res.status(502).send("No Query terms for Google Book search!");
   }


    var booksService = google.books('v1');
    console.log("Calling books.volumes.list");
    // For now, let's just use the API key
    var myKey = config.google.apiKey;
    console.log("Will use key: " + myKey);
    booksService.volumes.list({
      auth: myKey,
//      auth: auth,
      maxResults: 1,
//      q: 'flowers+inauthor:keyes'  // Hard-coded to start
        q: theQuery
    } ,  function(err, response) {
         if(err) {
           console.log("The Google Books AP returned an error: " + err);
           return res.status(502).send("Request to Google Books returned " + err);
         }
         var results = response.items;
         if(response.totalItems == 0) {
           console.log("The Google Books AP returned no results!");
           return res.status(200).json({ msg: "Request to Google Books returned no results!" });
         }
        console.log("From API ==> " + JSON.stringify(results));
         var bookRec = results[0];
         var qresult = {
           title: bookRec.volumeInfo.title,
           author: bookRec.volumeInfo.authors.join(", "),
           publisher: bookRec.volumeInfo.publisher,
           copywrite: bookRec.volumeInfo.publishedDate,
           description: bookRec.volumeInfo.description,
           image_url: bookRec.volumeInfo.imageLinks.thumbnail
         }
         //console.log("Returning ==> " + JSON.stringify(qresult));
         res.status(200).json(qresult);

    });


}
