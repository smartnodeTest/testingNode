var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelUser = require('../models/user.model'); 


const switchh = Schema({
  	_id: mongoose.Schema.Types.ObjectId,
  	Name: {type: String, required: true},
  	BtnNmbr: {type: String, required: true},
  	DeviceName: {type: String, required: true},
    GroupName: {type: String, required: true},
  	Isfav: {type: String, required: true},
	IconName: {type: String, required: true},
   	NotificationState: {type: String},
    assignedUser:{type: Schema.Types.ObjectId, ref: 'ModelUser'}                    
});

module.exports = mongoose.model('Switch', switchh);