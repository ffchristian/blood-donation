/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * PATCH   /api/things/:id          ->  patch
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import Thing from './thing.model';
import response from '../../components/response';

// Gets a list of Things
export function index(req, res) {
console.log(req.query)
  let maxDistance = req.query.distance || 8;
  maxDistance /= 6371;
  return Thing.list({"lng" : req.query.lng,"lat" : req.query.lat}, maxDistance)
    .then(response(res))
    .catch(response(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  return Thing.show(req.params.id)
    .then(response(res))
    .catch(response(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return Thing.store(req.body)
    .then(response(res))
    .catch(response(res));
}

// Upserts the given Thing in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Thing.update(req.params.id, req.body)
    .then(response(res))
    .catch(response(res));
}


// Deletes a Thing from the DB
export function destroy(req, res) {
  return Thing.destroy(req.params.id)
    .then(response(res))
    .catch(response(res));
}
