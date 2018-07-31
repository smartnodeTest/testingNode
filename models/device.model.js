var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelUser = require('../models/user.model'); 

const device = Schema({
  	_id: mongoose.Schema.Types.ObjectId,
  	Name: {type: String, required: true},
  	MainId: {type: String, required: true},
  	OpenId: {type: String, required: true},
    Token: {type: String, required: true},
  	HardwareType: {type: String, required: true},
	Type: {type: String, required: true},
   	TotalSwitches: {type: String, required: true},
    assignedUser:{type: Schema.Types.ObjectId, ref: 'ModelUser'}                    
});

module.exports = mongoose.model('Device', device);