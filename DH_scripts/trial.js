function processFile(officeFile) {
  var myDocsDir = process.env.USERPROFILE + "/Documents";
  if ((officeFile.match(/localhost:9000/)) || (officeFile.match(/127\.0\.0\.1:9000/))) {
    //  !!!!!!!!!!!!!!!  This will only work on NMCI Machine - Need to put into local config

    var docsDir = myDocsDir.replace(/\\/g, '/') + '/';
    console.log("Mydocsdir = " + docsDir);

    // Need to remove all the encoded crap
    var decodedFile = decodeURI(officeFile);
    console.log("decodedFile => " + decodedFile);

    // console.log("Should send to " + docsDir);
    officeFile = decodedFile.replace(/^http:\/\/localhost:9000\//, docsDir);
    console.log("First replace => " + officeFile);
    officeFile = officeFile.replace(/^http:\/\/127\.0\.0\.1:9000\//, docsDir);
    console.log("Second replace => " + officeFile);
  } else {
    officeFile = decodeURI(officeFile);
  }
  return officeFile;
}

var testVars = [
"http://localhost:9000/FFG(X)%20Manning%20Study-Final-20180629.docx",
"http://localhost:9000/ebooks/Node.js%20in%20Action%20by%20Mike%20Cantelon%20%7BZer07%7D.pdf",
"http://127.0.0.1:9000/ebooks/Node.js%20in%20Action%20by%20Mike%20Cantelon%20%7BZer07%7D.pdf"

];
for (var i=0; i<testVars.length; i++) {
  console.log(testVars[i] + " ==> " + processFile(testVars[i]));
}
