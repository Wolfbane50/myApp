var touch = require("touch");

var baseDir = "x:/cards/";

var filesToTouch = [
	"1963 phillies.png",
	"1963 Roy Sievers.png",
	"Aaron Nola 2015 Bowman.png",
	"Al Kaline.png",
	"Austin Wright Bowman Blue.png",
	"Curt Schilling Micd.png",
	"Darren Daulton.png",
	"Dominic Brown.png",
	"Frank Howard.png",
	"Frank Robinson.png",
	"Freddie Garcia.png",
	"Grady Sizemore.png",
	"Hank Aaron.png",
	"Heathcliff Slocumb.png",
	"Jim Bunning.png",
	"Jim Fregosi.png",
	"Joe Torre.png",
	"Marlon Byrd Donruss.png",
	"Marlon Byrd.png",
	"Mike Lieberthal SI.png",
	"Mitch Williams Triple.png",
	"Mitch Williams.png",
	"Nellie Fox.png",
	"Roberto Clemente.png",
	"Tony Gonzalez.png",
	"Warren Spahn.png",
	"Whitey Ford.png"
];

for (var i=0; i<filesToTouch.length; i++) {
  var filename = baseDir + filesToTouch[i];
  touch.sync(filename);
}
