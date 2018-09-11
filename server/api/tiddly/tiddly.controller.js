'use strict';

var fs = require("fs");
const path = require('path');



function getLatestFile({root, extension}, callback){
  fs.readdir(dloadDir, (_ , dirlist)=>{
    const latest = dirlist.map(_path => ({stat:fs.lstatSync(path.join(dloadDir, _path)), dir:_path}))
      .filter(_path => _path.stat.isFile())
      .filter(_path => extension ? _path.dir.endsWith(`.${extension}`) : 1)
      .filter(_path => root ? _path.dir.includes(`${root}`) : 1)
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .map(_path => _path.dir);
    callback(latest[0]);
  });
}

//getLatestFile({extension:'html'}, (filename=null)=>{
//  var destfile = filename.replace(/\(\d+\)/, '');
//  console.log("Moving " + dloadDir + '/' +  filename + " to " + destination + '/' + destfile);
//  fs.renameSync(dloadDir + '/' +  filename, destination + '/' + destfile)
//});


//const {
//  exec
//} = require('child_process');
import config from '../../config/environment';
const dloadDir =  config.myDownloadDir;

export function update(req, res) {
  // Should get dloadDir from Configuration rather than static
    var root = req.body.root;
    var destination = req.body.destination;

    console.log("Update " + dloadDir + '/' + root + ".html in " + destination);
    res.status(200);

}
