'use strict';




angular.module('myappApp')
  .directive('ngPrint', [function() {
    function printElement(elem, preview) {
      // clones the element you want to print
      if (preview) {
        alert("About to print preview");

        var printContents = elem.innerHTML;
        var popupWin = window.open('', '_blank', 'resizable=yes,scrollbars=yes,status=yes');
        popupWin.document.open();
        //popupWin.document.write('<html><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.write('<html><body>' + printContents + '</body></html>');
        popupWin.document.close();

      } else {
        var domClone = elem.cloneNode(true);

        printSection.appendChild(domClone);
        alert("About to print!");
        window.print();
      }
    }
    var printSection = document.getElementById('printSection');

    // if there is no printing section, create one
    if (!printSection) {
      printSection = document.createElement('div');
      printSection.id = 'printSection';
      document.body.appendChild(printSection);
    }
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          var elemToPrint = document.getElementById(attrs.printElementId);
          if (elemToPrint) {
            printElement(elemToPrint, attrs.preview);
          }
        });

        window.onafterprint = function() {
          // clean the print section before adding new content
          printSection.innerHTML = '';
        }
      }
    }
  }]);
