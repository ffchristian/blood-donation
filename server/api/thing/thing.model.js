'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';
import checkMandatoryFields from'../../components/entryValidation';
import {registerEvents} from './thing.events';
import ThingEvents from './thing.events';
var ThingSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  firstName: String,
  coordinate: {
    lng: Number,
    lat: Number
  },
  ip: String,
  lastName: String,
  address: String,
  number: String,
  bloodGroup: String,
  createdAt: {type: Date, default: new Date()}
});
ThingSchema.index({"coordinate": "2d"});
ThingSchema.statics = {
  list(coordinate, distance){
    const name = 'create';
    const _self = this;
    return new Promise((resolve, reject) => {
      try{
        _self.find({
          coordinate: {
            $nearSphere: coordinate,
            $maxDistance: distance
          }
        }).exec().then(response =>{
          resolve({statusCode: 200, message: 'SUCCESS',  data: response});
        })

      }catch (ex) {
        reject({statusCode: 500, message: String(ex)});
      }
    });
  },
  show(id){
    const name = 'create';
    const _self = this;
    return new Promise((resolve, reject) => {
      try{
        _self.findById(id).exec().then(response =>{
          resolve({statusCode: 200, message: 'SUCCESS',  data: response});
        })

      }catch (ex) {
        reject({statusCode: 500, message: String(ex)});
      }
    });
  },
  update(id, body){
    const name = 'create';
    const _self = this;
    return new Promise((resolve, reject) => {
      try{
        delete body.cordinate;
        delete body.address;
        return _self.findOne({_id: id}).exec()
          .then(point =>{
            let update = _.merge(point, body);
            update.coordinate = {
              lng: point.coordinate.lng,
              lat: point.coordinate.lat
            };
            console.log('update', update)
            point.save(update).then(response =>{
              ThingEvents.emit('save',update);
              resolve({statusCode: 200, message: 'UPDATED_SUCCESS',  data: {success: true, id: response._id}});
            });
          });
          //.catch(handleError(res));

      }catch (ex) {
        reject({statusCode: 500, message: String(ex)});
      }
    });
  },
  store(body){
    const name = 'create';
    const _self = this;
    return new Promise((resolve, reject) => {
      try{
        const validMandatoryFields = checkMandatoryFields(body, ['latitude','longitude','firstName', 'lastName', 'address', 'number', 'email', 'bloodGroup'], name);

        if (validMandatoryFields) {
          return reject(validMandatoryFields);
        }
          body.coordinate = {
            lng: body.longitude,
            lat: body.latitude
          };
        _self.create(body).then(response =>{
          ThingEvents.emit('save', response);
          resolve({statusCode: 201, message: 'CREATED_SUCCESS',  data: {success: true, id: response._id}});
        })

      }catch (ex) {
        reject({statusCode: 500, message: String(ex)});
      }
    });
  },
  destroy(id){
    const _self = this;
    return new Promise((resolve, reject) => {
      try{

        _self.findById(id).remove().exec().then(response =>{
          ThingEvents.emit('remove', {_id: id});
          resolve({statusCode: 204, message: 'SUCCESS',  data: {success: true, id: response._id}});
        })

      }catch (ex) {
        reject({statusCode: 500, message: String(ex)});
      }
    });
  }
}
registerEvents(ThingSchema);
export default mongoose.model('Thing', ThingSchema);
