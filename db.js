var mongojs = require('mongojs')
var config = require('./config/config.js')

var db = mongojs(config.db.mongodb)

exports.db = function() {
    return db
}
