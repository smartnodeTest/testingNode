var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelUser = require('../models/user.model'); 

const scene = Schema({
  	_id: mongoose.Schema.Types.ObjectId,
  	SceneName: {type: String, required: true},
  	SceneForGroup: {type: String, required: true},
    assignedUser:{type: Schema.Types.ObjectId, ref: 'ModelUser'}                    
});

module.exports = mongoose.model('Scene', scene);