// Test the publisher service
'use strict';

describe('Publisher service', () => {

  let $httpBackend;
  let mockPublisherResource;

  beforeEach(angular.mock.module('myappApp'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      mockPublisherResource = $injector.get('Publisher');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Can query DB for all publishers', inject(function(Publisher) {
    var thePublishers = [
      "Publisher 1",
      "Publisher 2"
    ];

    $httpBackend.expectGET('/api/books/publishers')
      .respond(thePublishers);

      var myPublishers = mockPublisherResource.query();

      $httpBackend.flush();

      expect(myPublishers.length).toEqual(2);
      expect(myPublishers[0]).toEqual('Publisher 1');
      expect(myPublishers[1]).toEqual('Publisher 2');


  }));


  it('Can create a new publisher', () => {
    var pubName = "My New Publisher";

    $httpBackend.expectPOST('/api/books/publishers', { name: "My New Publisher"})
      .respond();

      mockPublisherResource.create({
          name: pubName
        });
        $httpBackend.flush();
  });

  it('Can delete a publisher', () => {
    var pubName = "My Publsher";
    $httpBackend.expectDELETE('/api/books/publishers?name=My+Publsher')
      .respond();

      mockPublisherResource.delete({
          name: pubName
        });
        $httpBackend.flush();

  });
  it('Will cache multiple queries', () => {
    var thePublishers = [
      "Publisher 1",
      "Publisher 2"
    ];

    // Expect only on get request
    $httpBackend.expectGET('/api/books/publishers')
      .respond(thePublishers);

      var myPubs = mockPublisherResource.query();
      $httpBackend.flush();
      var myOtherPubs = mockPublisherResource.query();


  });


});
