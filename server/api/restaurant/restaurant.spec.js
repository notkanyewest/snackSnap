'use strict';

var app = require('../../app');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

xdescribe('POST /api/restaurant/new', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/restaurants/new')
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});
