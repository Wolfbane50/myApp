// Scrape Chachi to get a list of image links

var cheerio = require('cheerio');
var request = require('request');
// Save rendered frame source...
url = "http://127.0.0.1:8080/c2_tree/2015_Chachis.html";

var imageLinks = [];

request({method: 'GET',
         url: url}, function(err, response, body) {
           if (err) return console.error(err);
         //  console.log(body);

	var $ = cheerio.load(body);
	
	$('a').each(function() {
		var href = $(this).attr('href');
		console.log("Get images from \n\t" + href);
		request({method: 'GET', url: href}, function(err, res, body) {
			if (err) return console.error(err);
			var $ = cheerio.load(body);
			
			$('img').each(function() {
				
				var src=$(this).attr('src');
//				if (src && (src.match("/Chachi/"))) {
				if (src ) {
				  var pattern= /Chachi/;
				  if (pattern.test(src)) {
				    console.log("Found " + src);
				    imageLinks.push(src);
				  }
				}
			});
		});
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
	

	
});