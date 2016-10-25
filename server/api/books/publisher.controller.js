'use strict';
var fs = require("fs");
// Publishers

export function query(req, res) {
  res.redirect(303, '/publishers.json');
}

//export function get(req, res) {}
function getPublisherRecord() {
  try {
    var buf = fs.readFileSync("server/public/publishers.json");
    return  JSON.parse(buf.toString());
  } catch (err) {
    console.error("Could not read JSON file : " + err);
    res.status(502).send("Could not read JSON file : " + err);
    return null;
    // What to return???
  }

}

export function create(req, res) {
  var newPub = req.body.name;
  var publisherBlk = getPublisherRecord();
  if (publisherBlk) {

    publisherBlk.items.push({
      name: newPub
    });
    fs.writeFile("server/public/publishers.json", JSON.stringify(publisherBlk));
    res.status(201).send();
  }
}
//export function update(req, res) {}

export function del(req, res) {
  var delPub = req.body.name;
  var publisherBlk = getPublisherRecord();
  if (publisherBlk) {
   for (var i=0; i<publisherBlk.items.length; i++) {
     if(publisherBlk.items[i].name = delPub ) {
       publisherBlk.items.splice(i, 1);
       fs.writeFile("server/public/publishers.json", JSON.stringify(publisherBlk));
       return res.status(204).send();
     }
   }
   return res.status(404).send();  // Not found
  }

}
