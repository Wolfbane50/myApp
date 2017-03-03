var unshort = require('unshort');

unshort('http://bit.ly/2lvxTZn', function (err, url) {
  if (err) console.log("Error: " + err);
  console.log("URL: " + url); // http://github.com/julianduque
});
