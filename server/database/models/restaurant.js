var db = require('../config');
var Rating = require('./rating');
var Organization = require('./organization');
var Hour = require('./hour');


var Restaurant = db.Model.extend({
  tableName: 'restaurants',
  hasTimestamps: true,

  ratings: function(){
    return this.hasMany(Rating);
  },

  organizations: function(){
    return this.belongsToMany(Organization);
  },

  hours: function(){
    return this.hasMany(Hour);
  }

});


module.exports = Restaurant;