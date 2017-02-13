'use strict';

describe('Starred List service', () => {

  let starredListServiceObject;



  beforeEach(angular.mock.module('myappApp'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      starredListServiceObject = $injector.get('StarredListService');
    });
  });

// , () => {}
  it("Should be empty if not initialized", () => {
    expect(starredListServiceObject.list()).toEqual([]);
    starredListServiceObject.toggle(5);
    expect(starredListServiceObject.isStarred(5)).toBe(true);
    expect(starredListServiceObject.list()).toEqual([ '5' ]);
  });

  it("Can be initialized with a list of ids" , () => {
    var config = {};
    config.starredIds = [5, 20, 15, 16, 33];
    var sortedIds = config.starredIds.sort();
    starredListServiceObject.init(config)
    expect(starredListServiceObject.list().sort()).toEqual(sortedIds);

  });
  it("Will return true for any defined ids");
  it("Will return false for any non-defined ids");
  it("Will toggle from unstarred to starred");
  it("Will toggle from starred to unstarred");
  it("Will list all starred IDs");
  it("Will clear all starred IDs");
  it("Will callback to onChange when toggle occurs");
  it("Will callback to onChange when IDs cleared")
});
