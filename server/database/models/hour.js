var db = require('../config');
var Restaurant = require('./restaurant');


var Hour = db.Model.extend({
  tableName: 'hours',
  hasTimestamps: false,
  
  restaurants: function(){
    return this.belongsTo(Restaurant);
  }

});


module.exports = Hour;