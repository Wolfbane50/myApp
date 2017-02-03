'use strict';

(function() {
  class PublisherComponent {
  constructor(Publisher) {
    this.Publisher = Publisher;

    this.addingPub = false;
    this.deletePub = function(pub, idx) {
      if (confirm("Are you sure you want to delete this publisher?")) {
        this.publishers.splice(idx, 1);
        Publisher.delete({ name: pub.name});
      }
    };
    this.newPublisher = function() {
      var newPub = prompt("Name of new item: ");
      if(newPub) {
        this.publishers.push(newPub);
        Publisher.create({ name: newPub });
      }
    };
  }  // end constructor

  $onInit() {
    this.publishers = this.Publisher.query();
  } // end onInit
} // end component class

angular.module('myappApp')
  .component('publisherComponent', {
    templateUrl: 'components/publishers/publishers.html',
    controller: PublisherComponent
  });

})();
