'use strict';

var places = require('./places.js');
// var chaiAsPromised = require("chai-as-promised");
var Promise = require('bluebird');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

// chai.use(chaiAsPromised);

describe('Places Module', function() {

  it('should return the correct place for a search with address and name', function(done) {

    var address = '1044 Market St #8, San Francisco, CA 94102';
    var name = 'SnackSnap';

    places.getDetailsFromAddressAndName(address,name)
    .then(function(details){
      expect(details).to.be.an('array');
      var result = details[0].result;
      result.name.should.equal('SnackSnap');
      result.formatted_phone_number.should.equal('(415) 547-0254');
      done();
    });
  });

  it('should return the correct place for a search by ID', function(done){
    places.getDetails('ChIJNc25vYWAhYARppFtCl9Stb0')
    .then(function(details){
      expect(details).to.be.an('object');
      expect(details.name).to.equal('SnackSnap');
      done();
    });
  });

  it('should return the correct geocode for an address', function(done){
    places.geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA')
    .then(function(result){
      expect(result).to.be.an('array');
      console.log(typeof(result[0]));
      expect(result[0]).to.equal(37.4224764);
      expect(result[1]).to.equal(-122.0842499);
      done();
    });
  })

  it('should properly parse a Google Places opening hours object', function(){
    var opening_hours = {
      open_now: false,
      periods: [ { close: {time: '2200', day: 1}, open: {time: '0930', day: 1} },
                  { open: {time: '0002', day: 2} },
                  { open: {time: '0100', day: 4}, close: {time: '0529', day: 4} } ],
      weekday_text: [ 'Monday: 9:00 am – 8:30 pm',
           'Tuesday: 9:00 am – 8:30 pm',
           'Wednesday: 9:00 am – 8:30 pm',
           'Thursday: Closed',
           'Friday: 9:00 am – 8:30 pm',
           'Saturday: 9:00 am ��� 8:30 pm',
           'Sunday: 9:00 am – 8:30 pm' ] }; // opening hours test var

    var parsedHours = places.parseHours(opening_hours);
    expect(parsedHours).to.be.an('array');
    expect(parsedHours).to.have.length(3);
    parsedHours[1][1].should.equal('00:00:01');
    parsedHours[1][0].should.equal(2);
    parsedHours[2][2].should.equal('05:29:00');
    parsedHours[0][0].should.equal(1);
    parsedHours[0][1].should.equal('09:30:00');
    parsedHours[0][2].should.equal('22:00:00');

  });

});
