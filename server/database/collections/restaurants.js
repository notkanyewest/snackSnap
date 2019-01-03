var db = require('../config');
var Restaurant = require('../models/restaurant');

var Restaurants = new db.Collection();

Restaurants.model = Restaurant;

module.exports = Restaurants;