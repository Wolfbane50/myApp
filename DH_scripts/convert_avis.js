var fs = require('fs');
var path= require('path');
var sleep = require('sleep');

var handbrDir = "C:\\Users\\Daniel\\Downloads\\handbrake_out\\";
var jobFileName = "convert_avis_job.json";
//vidConfig = 'x:\drwho_tv_tree.json';
var vidConfig = 'drwho_tv_tree.json';
var netPath = "x:\\";


var jobFile;

function convert(job) {

     console.log("C:\\Program Files\\Handbrake\\HandBrakeCLI -i '" + job.inputFl + "' -o '" + job.outputFl );
}

function copyVid(job) {
   console.log("copy " + job.outputFl + " " + job.origDir);

}

console.log("Starting...");
try {
   jobFile = JSON.parse(fs.readFileSync(jobFileName).toString());
} catch (err) {
     // Assume need to create job file
     jobFile = [];

	var vidData = JSON.parse(fs.readFileSync(vidConfig).toString());

	vidData.forEach( function(doctor) {
		doctor.items.forEach( function (show) {
			if (show.episodes) {
				show.episodes.forEach (function (ep) {
					var pattern = /\.avi$/;
					if (pattern.test(ep.fname)) {
						// Need to log any videos with no path
						//console.log("Parsing " + ep.link);
						// Problem: Doctor.Who.1119.The.Monster.Of.Peladon.Part5.DVDRip.XviD-AVCDVD.avi
						var job = {
						        origDir : netPath + path.dirname(ep.link),
							inputFl : netPath + ep.link,
							outputFl : handbrDir + ep.fname.replace(pattern, ".mp4")
						};
						jobFile.push(job);

					}
				});
			}
		});
	});
	// Save the job file
	fs.writeFileSync(jobFileName, JSON.stringify(jobFile));
}

// Walk the array until work to be done is found
var currentJobNo = 0

while(currentJobNo < jobFile.length) {
	var job = jobFile[currentJobNo];
	if ((job.processed) && (job.copied)) {
		currentJobNo++;
	} else {
		break;
	}
}

      var processedCount = 0;
while(currentJobNo < jobFile.length) {


      var job = jobFile[currentJobNo];
      if (! job.processed) {
        convert(job);
      	job.processed = true;
      	// Save the job file after convert
 	fs.writeFileSync(jobFileName, JSON.stringify(jobFile));
     }
      if (! job.copied) {
        copyVid(job);
      	job.copied = true;


      	//Save the job file after copy;
 	fs.writeFileSync(jobFileName, JSON.stringify(jobFile));
       processedCount++;
      }

      if (processedCount % 4 == 0) {
         console.log("============================\n\nPausing after 4 jobs...CTL-C to exit\n\n============================");
         //sleep.sleep(10);
      }
      currentJobNo++;
}

console.log("I am done!");



