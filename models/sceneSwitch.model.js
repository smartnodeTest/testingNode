var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelUser = require('../models/user.model'); 

const sceneSwitch = Schema({
  	_id: mongoose.Schema.Types.ObjectId,
  	Name: {type: String, required: true},
  	BtnNmbr: {type: String, required: true},
  	DeviceName: {type: String, required: true},
    SceneName: {type: String, required: true},
  	GroupName: {type: String, required: true},
	State: {type: String, required: true},
   	Type: {type: String, required: true},
   	Checked: {type: String, required: true},
    assignedUser:{type: Schema.Types.ObjectId, ref: 'ModelUser'}                    
});

module.exports = mongoose.model('SceneSwitch', sceneSwitch);