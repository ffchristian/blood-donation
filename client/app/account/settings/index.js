'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('bloodDonationApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
