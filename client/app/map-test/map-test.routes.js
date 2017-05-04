'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/', {
      template: '<map-test></map-test>'
    });
}
