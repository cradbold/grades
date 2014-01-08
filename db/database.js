var mongoose = require('mongoose');
exports.mongoose = mongoose;
var bcrypt = require('bcrypt');
var SALT_ROUNDS = 12;

// connection
var uriString = 'mongodb://localhost/database';
var mongoOptions = { db: { safe: true }};
mongoose.connect(uriString, mongoOptions, function(err, res) {
	if (err) {
		console.log('Error connecting to: ' + uriString + ': ' + err);
	} else {
		console.log('Successful Connecting to: ' + uriString);
	}
});

var UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true, unique: false },
	lastName: { type: String, required: true, unique: false },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true},
	student: { type: Boolean, required: true },
	tutor: { type: Boolean, required: true }
});

 //bcrypt
UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password'))
		return next();
	bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
		if (err)
			return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err)
				return next(err);
			user.password = hash;
			next();
		});
	});
});

// password verification
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err)
			return callback(err);
		callback(null, isMatch);
	});
};

// models
exports.UserModel = mongoose.model('users', UserSchema);
