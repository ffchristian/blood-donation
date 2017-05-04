'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newThing;

describe('Thing API:', function() {
  describe('GET /api/things', function() {
    var things;

    beforeEach(function(done) {
      request(app)
        .get('/api/things?distance=3.483&lat=-33.458474389873665&lng=-70.591012490533')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(things.data).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/things', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/things')
        .send({
          email: 'test@test.com',
          firstName: 'name',
          lastName: 'name',
          latitude: '-33.458474389873665',
          longitude: '-70.591012490533',
          address: 'some',
          number: '21312',
          bloodGroup: 'A+',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      expect(newThing.data.success).to.equal(true);

    });
  });

  describe('GET /api/things/:id', function() {
    var thing;

    beforeEach(function(done) {
      request(app)
        .get(`/api/things/${newThing.data.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(function() {
      thing = {};
    });

    it('should respond with the requested thing', function() {
      expect(thing.data.email).to.equal('test@test.com');
      expect(thing.data.firstName).to.equal('name');
      expect(thing.data.lastName).to.equal('name');
    });
  });

  describe('PUT /api/things/:id', function() {
    var updatedThing;

    beforeEach(function(done) {
      request(app)
        .put(`/api/things/${newThing.data.id}`)
        .send({
          firstName: 'Updated firstName'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedThing = {};
    });

    it('should respond with the result', function() {
      expect(updatedThing.data.success).to.equal(true);
    });

    it('should respond with the updated thing on a subsequent GET', function(done) {
      request(app)
        .get(`/api/things/${newThing.data.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let thing = res.body;

          expect(thing.data.firstName).to.equal('Updated firstName');

          done();
        });
    });
  });

  describe('DELETE /api/things/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/things/${newThing.data.id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    /*it('should respond with 404 when thing does not exist', function(done) {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });*/
  });
});
