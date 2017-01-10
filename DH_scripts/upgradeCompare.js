var fs = require('fs');

var oldNpmConfig = "./package.json";
var oldBowerConfig = "./bower.json";

var newNpmConfig = "C:/blah/NodeJSPortable/App/DefaultData/node_modules/generator-angular-fullstack/angular-fullstack-deps/package.json";

var dependencies = {};
var devDependencies = {};

function oldNpm() {
  // Read old NPM file, get dependencies and dev dependencies, store in object with keys
  fs.readFile(oldNpmConfig, function(err, content) {
    if (err) {
      console.log('Could not read JSON file ' + oldNpmConfig + ": " + err);
      return;
    }
    //console.log(content.toString().substr(1, 8));

    //  var npmData = JSON.parse(content.toString().substr(1));
    var npmData = JSON.parse(content.toString());
    for (var prop in npmData.dependencies) {
      dependencies[prop] = {
        oldDependency: npmData.dependencies[prop]
      };
    }
    for (var prop in npmData.devDependencies) {
      devDependencies[prop] = {
        oldDependency: npmData.devDependencies[prop]
      };
    }
    oldBower();

  });
}

function oldBower() {
  // Read old bower file and add dependencies and dev dependencies to object

  fs.readFile(oldBowerConfig, function(err, content) {
    if (err) {
      console.log('Could not read JSON file ' + oldNpmConfig + ": " + err);
      return;
    }
    //console.log(content.toString().substr(1, 8));

    //  var npmData = JSON.parse(content.toString().substr(1));
    var bowerData = JSON.parse(content.toString());
    for (var prop in bowerData.dependencies) {
      if (dependencies[prop]) {
        dependencies[prop].oldBowerDependency = bowerData.dependencies[prop];
      } else {
        dependencies[prop] = {oldBowerDependency : bowerData.dependencies[prop] };

      }
    }
    for (var prop in bowerData.devDependencies) {
      if(devDependencies[prop]) {
        devDependencies[prop].oldBowerDependency = bowerData.devDependencies[prop];
      } else {
        devDependencies[prop] =  { oldBowerDependency : bowerData.devDependencies[prop] };
      }

    }
    newNpm();
  });
}

function newNpm() {
  // Reqd new NPM config file, get new dependencies
  fs.readFile(newNpmConfig, function(err, content) {
    if (err) {
      console.log('Could not read JSON file ' + oldNpmConfig + ": " + err);
      return;
    }
    //console.log(content.toString().substr(1, 8));

    //  var npmData = JSON.parse(content.toString().substr(1));
    var npmData = JSON.parse(content.toString());
    for (var prop in npmData.dependencies) {
      if (dependencies[prop]) {
        dependencies[prop].newDependency = npmData.dependencies[prop];
      } else {
        dependencies[prop] = { newDependency : npmData.dependencies[prop] };
      }

    }
    for (var prop in npmData.devDependencies) {
      if (devDependencies[prop]) {
        devDependencies[prop].newDependency = npmData.devDependencies[prop];
      } else {
        devDependencies[prop] = { newDependency : npmData.devDependencies[prop] };
      }

    }
    genReport();
  });
}

// Generate a report with all dependencies and old and new versions
function genReport() {
  console.log("Dependency, Old Npm, Old Bower, New Npm")
  console.log("Dependencies");
  for (var prop in dependencies) {
    var dep = dependencies[prop];
    console.log(prop + ", " + dep.oldDependency + ", " + dep.oldBowerDependency + ", " + dep.newDependency);
  }
  console.log("");
  console.log("Development Dependencies");
  for (var prop in devDependencies) {
    var dep = devDependencies[prop];
    console.log(prop + ", " + dep.oldDependency + ", " + dep.oldBowerDependency + ", " + dep.newDependency);
  }
}

oldNpm();
