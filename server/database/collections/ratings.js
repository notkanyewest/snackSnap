var db = require('../config');
var Rating = require('../models/rating');

var Ratings = new db.Collection();

Ratings.model = Rating;

module.exports = Ratings;