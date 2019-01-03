var db = require('../config');
var Organization = require('../models/organization');

var Organizations = new db.Collection();

Organizations.model = Organization;

module.exports = Organizations;