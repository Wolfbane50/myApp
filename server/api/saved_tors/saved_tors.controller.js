/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/backups              ->  index
 * POST    /api/backups              ->  create
 * GET     /api/backups/:id          ->  show
 * PUT     /api/backups/:id          ->  update
 * DELETE  /api/backups/:id          ->  destroy
 */

'use strict';
//import fs from 'fs';
const Feedly = require('feedly')

export function getTorNumber (url) {
  if (url.match(/yourbittorrent.com/)) {
    var torNum = url.replace(/https:\/\/yourbittorrent.com\/torrent\//, "");
    torNum = torNum.replace(/\/.*$/, "");
    return torNum;
    //https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html
  }
}
export function getTorrents(req, res) {
  const f = new Feedly({
    client_id: 'MY_CLIENT_ID',
    client_secret: 'MY_CLIENT_SECRET',
    port: 8080
  });


}
