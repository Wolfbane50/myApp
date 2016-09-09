fs = require('fs');

var cardList;
// Synchrounsly read the file since we cannot do anything without it
  var buf = fs.readFileSync("newbunt.json");
  cardList = JSON.parse(buf.toString());

for (var i=0; i<cardList.cards.length; i++) {
  var card = cardList.cards[i];
  console.log(card.name + " , " + card.id);
}
