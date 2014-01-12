module.exports = function(gc) {

	var db = require('../db/database');
	var bcrypt = require('bcrypt');
	var SALT_ROUNDS = 12;
	var uuid = require('node-uuid');
	var fs = require("fs");

	var getIndex = function(req, res) {
		res.render('index', {
			user: req.user,
			message: req.session.messages
		});
	};

	var postIndex = function(req, res, next) {
		gc.passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.session.messages = [info.message];
				return res.redirect('/index');
			}
			req.login(user, function(err) {
				if (err) {
					return next(err);
				}
				return res.redirect('/grades');
			});
		})(req, res, next);
	};

	var profile = function(req, res) {

		var student = [];

		var getStud = function(cb) {

			if (req.user.owner == 'true') {

				db.UserModel.find({
					owner: req.user._id
				}).exec(function(err, studData) {
					student = studData;
					cb(null);
				});
			} else {
				cb(null);
			}
		}

		var renderAction = function(cb) {

			res.render('profile', {
				user: req.user,
				student: student,
				session: req.session,
				message: req.session.messages
			});
		}

		getStud(function(cb) {
			renderAction(function(cb) {});
		});
	};
	var postProfile = function(req, res) {

		var formData = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			address: req.body.address,
			// photo: req.body.photo,
		};

		if (req.files.photo && req.files.photo.path) {

			var fileName = uuid.v1();
			var ext = req.files.photo.name.split('.');
			ext = ext[ext.length - 1];

			switch (req.files.photo.type) {
				case 'image/png':
					ext = 'png';
					break;
				case 'image/jpg':
					ext = 'jpg';
					break;
				case 'image/gif':
					ext = 'gif';
					break;
			}

			// --

			fileName += fileName + '.' + ext;
			fs.readFile(req.files.photo.path, function(err, data) {
				var newPath = __dirname + "/../public/img/uploads/" + fileName;
				fs.writeFile(newPath, data, function(err) {});
			});
		}

		// /media/icoder/9E601385601362F7/js/grades/public/img/uploads



		var bcryptPassword = function(cb) {
			bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
				if (err) {
					console.log(err);
				}

				bcrypt.hash(formData.password, salt, function(err, hash) {

					if (err) {
						console.log(err);
					}
					// @todo remove this comment		
					// formData.password = hash;
					cb(null);
				});
			});
		};

		var updateUser = function(cb) {

			db.UserModel.update({
					_id: req.body.userId
				},
				formData
			).exec(function(err, user) {

				if (err) {
					console.log(err);
					res.flash('error', 'Email address is already exists.');
					res.redirect('/profile');
				} else {
					// req.user = user;
					res.flash('success', 'Profile settings has been succesfully updated.');
					return res.redirect('/profile');
				}

			});
		}

		bcryptPassword(function(cb) {
			updateUser(function(cb) {});
		});
	};

	var getGrades = function(req, res) {
		res.render('grades', {
			user: req.user,
			session: req.session,
			message: req.session.messages
		});
	};

	var getLogout = function(req, res) {
		console.log('logging out...');
		req.logout();
		res.redirect('/index');
	};

	gc.get('/', getIndex);
	gc.post('/', postIndex);
	gc.get('/index', getIndex);
	gc.post('/index', postIndex);
	gc.get('/profile', profile);
	gc.post('/profile', postProfile);
	gc.get('/grades', gc.auth.ensureAuthenticated, getGrades);
	gc.get('/logout', getLogout);
};