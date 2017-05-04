'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/update-information/:id', {
      template: '<update-information></update-information>'
    });
}
