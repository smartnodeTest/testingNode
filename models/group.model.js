var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelUser = require('../models/user.model'); 

const group = Schema({
  	_id: mongoose.Schema.Types.ObjectId,
  	GroupName: {type: String, required: true},
  	GroupImage: {type: String, required: true},
    assignedUser:{type: Schema.Types.ObjectId, ref: 'ModelUser'}                    
});

module.exports = mongoose.model('Group', group);