'use strict';
var google = require('googleapis');
var myGoogle = require('../../config/myGoogleApiCfg');
var encodeUrl = require('encodeurl');
var myRequest = require('request');
import config from '../../config/environment';

export function query(req, res) {
  myGoogle.authThenProcess(req, res, bookQuery);
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
    //console.log("Query String: " + theQuery);
   // Should not send if there is no query
   if (theQuery == "") {
      console.log("No Query terms for Google Book search!")
      return res.status(502).send("No Query terms for Google Book search!");
   }


    var booksService = google.books('v1');
  //  console.log("Calling books.volumes.list");
    // For now, let's just use the API key
    var myKey = config.google.apiKey;
    //console.log("Will use key: " + myKey);
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
        //console.log("From API ==> " + JSON.stringify(results));
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

// Load Stage functionality - Search input directory for all document types and return to client
export function loadstage(req, res) {
  // Proxy to start
  var reqOptions = {
    url : 'http://localhost:3000/loadstage/getfiles',
    qs : req.query,
    headers: {
      'Accept' : 'application/json'
    }
  } ;

console.log("Sending GET to loadstage/getfiles" + req.query);
  myRequest(reqOptions, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
//     console.log(": " +  response.headers['content-type']);
      //console.log('Request OK: ' + JSON.stringify(body));

      //return res.status(response.status).json(body);
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
    }
  });


}

// Tag Cloud Functionality --> Proxy to RoR implementation
export function tagCloud(req, res) {
  //console.log("In tag_cloud...");
  var reqOptions = {
    url : 'http://localhost:3000/documents/tag_cloud',
    headers: {
      'Content_Type': 'application/json',
      'Accept' : 'application/json'
    }
  } ;

  myRequest(reqOptions, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
//      console.log(": " +  response.headers['content-type']);
//      console.log('Request OK: ' + body);

      //return res.status(response.status).json(body);
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
    }
  });

}

export function docsWithTag(req, res) {
  var tagId = req.query.id;
  var reqOptions = {
    url : 'http://localhost:3000/documents/tag',
    qs : req.query,
    headers: {
      'Content_Type': 'application/json',
      'Accept' : 'application/json'
    }
  } ;
  myRequest(reqOptions, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
//      console.log(": " +  response.headers['content-type']);
//      console.log('Request OK: ' + body);

      //return res.status(response.status).json(body);
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
    }
  });

}

export function tagsForDoc(req, res) {
  var docId = req.query.id;
  var reqOptions = {
    url : 'http://localhost:3000/documents/' + docId + '/docTags',
    headers: {
      'Content_Type': 'application/json',
      'Accept' : 'application/json'
    }
  } ;
  myRequest(reqOptions, function(error, response, body) {
    if(error) {
      console.log("Request returned error -> " + error);
      return res.status(response.statusCode).send(body);
    } else {
//      console.log(": " +  response.headers['content-type']);
      console.log('Request OK: ' + JSON.stringify(body));

      //return res.status(response.status).json(body);
      res.set('Content-Type', 'application/json');
      res.status(response.statusCode).send(body);
    }
  });
}

export function epubReader(req, res) {
    // Get URL to epub
    var epubUrl = req.body.url;
    res.render('epub_reader', { url: epubUrl});
}
