'use strict';

var mysub = require("./mysub.js");

var proxy1 = new mysub.Proxy("http://wwww.one.html");
var proxy2 = new mysub.Proxy("http://wwww.two.html");
//var proxy1 = require('./mysub')("http://wwww.one.html");
//var proxy2 = require('./mysub')("http://wwww.two.html");

proxy1.print();
proxy2.print();
