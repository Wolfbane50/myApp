const fs = require('fs');
const path = require('path');

const dloadDir = "/Users/daniel.heaney/Downloads";
const tarDestination = "/Users/daniel.heaney/Documents/Frigate TAR/ECP_FFG";
const destination = "/Users/daniel.heaney/Documents/Frigate";

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

getLatestFile({root:'ffg_notes', extension:'html'}, (filename=null)=>{
  var destfile = filename.replace(/\(\d+\)/, '');
  console.log("Moving " + dloadDir + '/' +  filename + " to " + destination + '/' + destfile);
  //fs.renameSync(dloadDir + '/' +  filename, destination + '/' + destfile)
});
getLatestFile({root:'TAR_tiddlyWiki', extension:'html'}, (filename=null)=>{
  var destfile = filename.replace(/\(\d+\)/, '');
  console.log("Moving " + dloadDir + '/' +  filename + " to " + tarDestination + '/' + destfile);
  //fs.renameSync(dloadDir + '/' +  filename, tarDestination + '/' + destfile)
});
