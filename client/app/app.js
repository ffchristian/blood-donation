'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import 'angular-socket-io';
const ngRoute = require('angular-route');
const mask = require('angular-input-masks');

import uiBootstrap from 'angular-ui-bootstrap';

import 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import mapTest from './map-test/map-test.component';
import update from './update-information/update-information.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';


import './app.css';

angular.module('bloodDonationApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', ngRoute,
  uiBootstrap, _Auth, account, admin, 'validation.match', navbar, footer, constants,
   util, socket, 'esri.map', mapTest, update, mask, ngAnimate, 'oitozero.ngSweetAlert'
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['bloodDonationApp'], {
      strictDi: true
    });
  });
