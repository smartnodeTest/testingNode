const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {type: String, required: true,unique: true},
	password: {type: String},
	firstName: {type: String},
	lastName: {type: String},
	provider : {type: String, required: true},
	faceBookId : {type: String}
},
{timestamps: true});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('ModelUser', UserSchema);