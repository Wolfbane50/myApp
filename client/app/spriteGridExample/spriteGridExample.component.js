'use strict';

(function(){

class SpriteGridExampleComponent {
  constructor() {
    this.Doc = "";

    this.Featuring = "Adric, Nyssa";
    this.blah = "3rd, War";
  }
}

angular.module('myappApp')
  .component('spriteGridExampleComponent', {
    templateUrl: 'app/spriteGridExample/spriteGridExample.html',
    controller: SpriteGridExampleComponent,
    controllerAs: 'SpriteGridExample'
  });

})();
