
var fs = require('fs');


var jsonFile = "server/public/spriteSpec.min.json";
var theJson = {
	// URL to file with sprite images
	//    Will be subject to browser cross-domain restrictions as this will be requested from the browser.
	"spriteFile" : "doctor_featuring3.png",

	// Define units used all spacing parameters, defaults to pixels (px)
	"spacingUnits" : "px",

	// Height and width of all images
	"imageWidth" : 91,
	"imageHeight" : 85,

	// Define margins (empty space between top, left of entire image and rows/columns of sprites
	"topMargin"  : 0,
	"leftMargin" : 0,

	// Vertical pads:  Define spacing between columns of images
	//    vertPad :  constant pad between all columns
	//    vertPadVector:  Used for different padding between columns.
	//         First entry should be zero
	//         Vector length (number of entries in array must be equal to the number of columns
	//               or exception will be thrown.
	//    If vertPad and vertPadVector are defined, vertPadVector will be used
	//    If neither vertPad nor vertPadVector are defined, padding will be assumed to be 0
	//
	//    "vertPad" : 10,
	"vertPadVector" : [
	   0,
	   8,
	   10,
	   12,
	   11,
	   15,
	   12,
	   11,
	   11,
	   13,
	   11,
	   14,
	   9,
		 13,
	   5,
	   6
	],

	// Horizontal pads:  Define spacing between rows of images
	//    horizPad :  constant pad between all rowss
	//    horizPadVector:  Used for different padding between rows.
	//         First entry should be zero
	//         Vector length (number of entries in array must be equal to the number of rows
	//               or exception will be thrown.
	//    If horizPad and horizPadVector are defined, horizPadVector will be used
	//    If neither horizPad nor horizPadVector are defined, padding will be assumed to be 0
	//
	//    "horizPad" : 10,
	"horizPadVector" : [
	   0,
	   9,
	   13,
	   9,
	   12,
	   11,
	   8,
	   12,
	   13,
	   11,
	   8,
	   12
	],

	//  Sprite key definitions.  Define names/keys to access sprite images with by row and column
	"spriteTable" : [
		    [       // Row 1
			"Cybermen",            // C1
			"Daleks",	       // C2
			"Sontarans",	       // C3
			"Weeping Angels",      // C4
			"Ice Warriors",	       // C5
			"6th Doctor",	       // C6
			"Rani",		       // C7
			"Autons",	       // C8
			"Davros",	       // C9
			"10th Doctor",	       // C10
			"11th Doctor",	       // C11
			"Jago and Litefoot"    // C12
		    ] , [   // Row 2
			"Susan",	       // C1
			"Sally",	       // C2
			"UNIT",		       // C3
			"Magnus Greel",	       // C4
			"dupe Adric",	       // C5
			"Fenric",	       // C6
			"Mel",		       // C7
			"Grace Holloway",      // C8
			"Rose",		       // C9
			"The Eminence",	       // C10
			"Amy Pond",	       // C11
			"Kraals"	       // C12

		   ] , [   // Row 3
			"Barbara",	       // C1
			"Wirrn",	       // C2
			"Liz Shaw",	       // C3
			"Haemovores",	       // C4
			"dupe Nyssa",	       // C5
			"Master I",	       // C6
			"Ace",		       // C7
			"Missy",	       // C8
			"Counter-Measures",    // C9
			"Mickey",	       // C10
			"Dupe Whatshername",   // C11
			"The Valyard"	       // C12

		     ] , [   // Row 4
			"Ian",		       // C1
			"Jamie",	       // C2
			"Jo Grant",	       // C3
			"Harry Sullivan",      // C4
			"dupe Teegan",	       // C5
			"Master 6",	       // C6
			"Master 3",	       // C7
			"Master 5",	       // C8
			"Captain Jack",        // C9
			"dupeDonna",           // C10
			"Rory",		       // C11
			"Brigadier Bambera"    // C12

		   ] , [   // Row 5
			"Vicki",	       // C1
			"Victoria",	       // C2
			"Sarah Jane",	       // C3
			"Leela",	       // C4
			"Turlough",	       // C5
			"Master 2",	       // C6
			"Master 4",	       // C7
			"Chang Lee",	       // C8
			"Unknown",	       // C9
			"Martha Jones",	       // C10
			"Craig Owens",	       // C11
			"Tractators"           // C12

		    ] , [   // Row 6
			"Steven Taylor",       // C1
			"Zoe",		       // C2
			"Omega",	       // C3
			"K9",		       // C4
			"Kamelion",	       // C5
			"Slitheen",	       // C6
			"Rutans" ,	       // C7
			"Astrid",	       // C8
			"Celestial Toymaker",  // C9
			"Eldrad",	       // C10
			"Canton",	       // C11
			"The Monk"	       // C12
		] , [   // Row 7
			"Katarina", 	       // C1
			"Will",		       // C2
			"Iris Wildthyme",      // C3
			"Romana I",	       // C4
			"Peri",		       // C5
			"Yeti",		       // C6
			"Thals",	       // C7
			"Nimon",	       // C8
			"Fitz",		       // C9
			"Donna",	       // C10
			"Clara",	       // C11
			"The Swarm"	       // C12
		    ] , [   // Row 8
			"Dodo",		       // C1
			"Evelyn",	       // C2
			"Mechonoids",	       // C3
			"Romana II",	       // C4
			"Brigadier",	       // C5
			"Zygons",	       // C6
			"Rassilon",	       // C7
			"Lucie Miller",	       // C8
			"Izzy",		       // C9
			"River Song",	       // C10
			"Vyrans",	       // C11
			"Sil"    	       // C12
		    ] , [   // Row 9
			"Polly",	       // C1
			"Thomas Brewster",     // C2
			"Osiran",	       // C3
			"Adric",	       // C4
			"Zara",		       // C5
			"Black Guardian",      // C6
			"Yates",	       // C7
			"C'rizz",	       // C8
			"Mary Shelly",	       // C9
			"Wilfred Mott",	       // C10
			"Draconians",	       // C11
			"The Headhunter"       // C12
		    ] , [   // Row 10
			"Ben",		       // C1
			"Frobisher",	       // C2
			"DI Menzies",	       // C3
			"Nyssa",	       // C4
			"Amy",		       // C5
			"White Guardian",      // C6
			"Benton",	       // C7
			"Hex",		       // C8
			"Maxwell Edison",      // C9
			"Rachel Cooper",       // C10
			"Mara",		       // C11
			"Morbius"	       // C12
		    ] , [   // Row 11
			"Charlotte Pollard",   // C1
			"Nimrod",	       // C2
			"Erimem",	       // C3
			"Tegan",	       // C4
			"Elizabeth Klein",     // C5
			"Flip",		       // C6
			"Constance",	       // C7
			"Raine Creevy",	       // C8
			"Aristedes",	       // C9
			"Axos",		       // C10
			"Voc Robots",	       // C11
			"Krynoid"	       // C12
		    ] , [   // Row 12
			"The Eight Legs",      // C1
			"Tamsin Drew",	       // C2
			"Alex Campbell",       // C3
			"Molly O'Sullivan",    // C4
			"Liv Chenka",	       // C5
			"King Peladon",	       // C6
			"Alpha Centauri",       // C7
			"Garundel",	       // C8
			"Bernice Summerfield", // C9
			"Beep the Meep",       // C10
			"Shayde",	       // C11
			"Krotons"	       // C12
		    ] , [   // Row 13
			"Menoptera",	       // C1
			"Zarbi",	       // C2
			"Kalendorf",	       // C3
			"Susan Mendes",	       // C4
			"Ogrons",	       // C5
			"Quadrigger Stoyn",    // C6
			"Raston Warrior",      // C7
			"Jason",	       // C8
			"Crystal",	       // C9
			"Vardans",	       // C10
			"Mavic Chen",	       // C11
			"Oliver Harper"	       // C12
		    ] , [    // Row 14
			"Silence",	       // C1
			"Bill",		       // C2
			"Nardole",	       // C3
			"Churchill",	       // C4
			"Kate Stewart",	       // C5
			"Osgood",	       // C6
			"Ashildr",	       // C7
			"2nd Doctor",	       // C8
			"3rd Doctor",	       // C9
			"4th Doctor",	       // C10
			"5th Doctor",	       // C11
			"7th Doctor"	       // C12
		    ] , [    // Row 15
			"Silurians",	       // C1
			"The Inquisitor",	// C2	       
			"The Eleven",	       // C3
			"Sylvia Noble",	       // C4
			"Sherlock Holmes",	// C5       
			"Sara Kingdom",	       // C6
			"Ood",	       	       // C7
			"Mrs Wibbsey",	       // C8
			"Mila",	       	       // C9
			"Matthew Sharpe",	// C10       
			"Kazran Sardick",	// C11       
			"Jackie Tyler"	       // C12
		    ] , [    // Row 16
			"Helen Sinclair",	// C1       
			"Dorium Maldovar",	// C2	       
			"Daniel Hopkins",	// C3       
			"Christina de Souza",	// C4       
			"Charlie Sato",	       	// C5 
			"Adam Mitchell",	// C6       
			"Yasmin",	       	// C7
			"Graham",	       	// C8
			"Ryan",	       		// C9
			"",	       		// C10
			"",	       		// C11
			""	       		// C12
				]
		],

		// Alias map defines alternate names for various sprites.
		//     Just point alternate name (key) to name (value) in the sprite table.
		"aliasMap" : {
			"Master" : "Master I",
			"The Master" : "Master I",
			"The Brigadier" : "Brigadier",
			"Sara" : "Sara Kingdom",
			"Matthew" : "Matthew Sharpe",
			"Martha" : "Martha Jones",
			"Raine" : "Raine Creevy",
			"Viyrans" : "Vyrans",
			"Benny" : "Bernice Summerfield",
			"Lucie" : "Lucie Miller"
		}

};

fs.writeFile(jsonFile,  JSON.stringify(theJson));

