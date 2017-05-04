'use strict';
/*eslint-env node*/
var testsContext;

require('babel-polyfill');
require('angular');
require('angular-mocks');

require('./client/components/socket/socket.mock');

testsContext = require.context('./client', true, /\.spec\.js$/);
console.log(testsContext);
testsContext.keys().forEach(testsContext);
