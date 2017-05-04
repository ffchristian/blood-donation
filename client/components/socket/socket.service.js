'use strict';

import * as _ from 'lodash';
import angular from 'angular';
//import io from 'socket.io-client';

function Socket(socketFactory) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

 /* var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket
  });*/

  var ioSocket = socketFactory();

  var socket = socketFactory({
    ioSocket: ioSocket
  });

  return {
    socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(`${modelName}:save`, function(item) {
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if(oldItem) {
          oldItem.attributes =  {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            number: item.number,
            bloodGroup: item.bloodGroup,
            address: item.address
          }
          array.splice(index, 1, oldItem);
          event = 'updated';
        } else {
          //array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(`${modelName}:remove`, function(item) {
        console.log('item-->', item);
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },

    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates(modelName) {
      socket.removeAllListeners(`${modelName}:save`);
      socket.removeAllListeners(`${modelName}:remove`);
    }
  };
}

export default angular.module('bloodDonationApp.socket', [])
  .factory('socket', Socket)
  .name;
