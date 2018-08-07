

function getTorNumber (url) {
  if (url.match(/yourbittorrent.com/)) {
    var torNum = url.replace(/https:\/\/yourbittorrent.com\/torrent\//, "");
    torNum = torNum.replace(/\/.*$/, "");
    return torNum;
    //https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html
  }
}

var inpUrl = "https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html";
console.log("Number: " + getTorNumber(inpUrl));
