'use strict';
import update from './update-information.component';
//import sweet from '../../../node_modules/angular-sweetalert/SweetAlert';
import {
  UpdateInformationController
} from './update-information.component';

describe('Component: UpdateInformationComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(update));
  beforeEach(angular.mock.module('oitozero.ngSweetAlert'));

  var UpdateInformationComponent;
  var $httpBackend;
  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, SweetAlert) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things/:id')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    UpdateInformationComponent = $componentController('updateInformation', {
      $http,
      SweetAlert
    });
  }));

  it('should attach information to the controller', function() {
    UpdateInformationComponent.$onInit();
    UpdateInformationComponent.update();
    UpdateInformationComponent.delete();
    expect(typeof UpdateInformationComponent.user).to.equal('object');
  });
});
