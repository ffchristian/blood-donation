'use strict';
import map from './map-test.component';
import uiBootstrap from 'angular-ui-bootstrap';
import {
  MapTestComponent
} from './map-test.component';
describe('Component: MapTestComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(map));
  beforeEach(angular.mock.module('socketMock'));
  beforeEach(angular.mock.module('esri.map'));
  beforeEach(angular.mock.module(uiBootstrap));

  var MapTestComponent;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($http, $componentController, $rootScope, socket) {
    scope = $rootScope.$new();
    MapTestComponent = $componentController('mapTest', {
        $http,
        socket
    });
  }));


  it('should check controllers', function() {
    MapTestComponent.$onInit();
    MapTestComponent.open();
    //expect(1).to.equal(1);
  });
});
