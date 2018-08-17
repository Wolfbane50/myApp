var fs = require('fs');
var Feedly = require('feedly');

function getTorNumber(url) {
  if (url.match(/yourbittorrent.com/)) {
    var torNum = url.replace(/https:\/\/yourbittorrent.com\/torrent\//, "");
    torNum = torNum.replace(/\/.*$/, "");
    return torNum;
    //https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html
  }
}

//ar inpUrl = "https://yourbittorrent.com/torrent/13085960/video-post-%E2%80%93-video-sharing-html-template.html";
//console.log("Number: " + getTorNumber(inpUrl));

function getTorrents() {
  const f = new Feedly({
    client_id: 'f402f196-d4dd-4471-ab35-d8c8a7de8d23',
    client_secret: 'AzZ6asvwdFmkZv2ATbxwIg7LE5CUSj19nCZfWUbDdEx4YANfb8vNdr3Zd0LLUb4Dq_b38K8hxoeIGQoElHGi-Lb4zmz7iMcdc_4340JeNlDtkXnZMltlnhj-sWOCGq6Hdib71SHv8xn670BF_NWdor7OHTchqw1rycJON4ZuIf9v9wYMNla-O3MoTsTzP-fG7vS_SDFqUMP3Zhl0e-3Hrgl5nv3v2LBwhjMiyJwZedp0WwbZ9du0iImcvUNDHA:feedlydev',
    port: 8080
  });


  // (promise(Array(Subscription))) subscriptions(cb)
  f.subscriptions().then(function(results) {
      console.log(JSON.stringify(results));
      // process results
    },
    function(error) {
      // process error
      console.log("Call to subscriptions failed ==> " + error);
    });
}

getTorrents();
