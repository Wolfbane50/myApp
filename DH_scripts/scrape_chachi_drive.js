// Scrape Chachi to get a list of image links

var cheerio = require('cheerio');
var http = require('http');
// Save rendered frame source...
url = "http://192.168.1.151:8080/2015_Chachis.html";
//url = "file://2015_Chachis.html";

var imageLinks = [];

http.get(url, function(html) {
	var $ = cheerio.load(html);
	// Should be more precise

//	var links = $('a.href');  // This is not correct syntax for search
	console.log("Checking " + links);
	$('a').each(function(i, link) {
		var url = $(this).attr('href');
		console.log(url);
	});
	
//	console.log("Found " + links.length + " Links");

//	links.each(function(link) {
//		console.log("Get images from " + link);
//		http.get(link, function(err, html) {
//			var $ = cheerio.load(html);
//
//			var srcs = $('img').attr('src');
//			imageLinks = imageLinks.concat(srcs);  
//			console.log("Saving images:  " + srcs.toString());
//		});
//
//	});
	
}).on('error', function(e) {
   console.log("Got error: " + e.message);
	
});