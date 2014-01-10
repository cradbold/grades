module.exports = function(gc) {

	var api = "/api";
	var version = '/v0.1';
	var prefix = api + version;
	var db = require('../db/database');

	gc.get(api, function(req, res) {
		res.send('GC API is up and running -- append a version...\n');
	});

	gc.get(prefix, function(req, res) {
		res.send('GC ' + version + ' API is up and running...\n');
	});

	gc.get(prefix + '/meeting', function(req, res) {
		if (!req.user || req.user.userType != 'teacher') {
			res.send([]);
			return;
		}
		db.meeting.find({}).sort({
			_id: 1
		}).exec(function(err, data) {
			if (err) {
				console.log(err);
			}
			var convertedD = [];
			var userId = req.user['_id'];
			if (data.length !== undefined) {
				for (var row in data) {
					var isAvai = false;
					var avaiTeach = data[row].teachers;
					if (avaiTeach) {
						for (var index in avaiTeach) {
							if (avaiTeach[index] && (avaiTeach[index]).toString() == userId.toString()) {
								isAvai = true;
							}
						}
					}
					convertedD.push({
						_id: data[row]._id,
						isAvai: isAvai,
						subject: data[row].subject,
						description: data[row].description,
						datetime: data[row].datetime
					});
				}
			}
			res.json(convertedD);
		});
	});

	gc.get(prefix + '/student-meeting', function(req, res) {
		if (!req.user || req.user.userType != 'student') {
			res.send([]);
			return;
		}
		var getTeachers = function(cb) {
			db.UserModel.find({
				userType: 'teacher'
			}, {
				_id: true,
				username: true
			}).exec(function(err, data) {
				var convertedD = [];
				if (data) {
					for (var row in data) {
						convertedD[data[row]._id] = data[row].username;
					}
				}
				cb(err, convertedD);
			});
		}
		var getMeeting = function(teachersD, cb) {
			db.meeting.find({}).sort({
				_id: 1
			}).exec(function(err, data) {
				if (err) {
					console.log(err);
				}
				var convertedD = [];
				var userId = req.user['_id'];
				if (data.length !== undefined) {
					for (var row in data) {
						var teacherGuy = data[row].teachers;
						var teacherNm = [];
						if (teacherGuy) {
							for (var i in teacherGuy) {
								if (teachersD[teacherGuy[i]]) {
									teacherNm.push(teachersD[teacherGuy[i]]);
								}
							}
						}
						convertedD.push({
							subject: data[row].subject,
							_id: data[row]._id,
							teachers: teacherNm,
							description: data[row].description,
							datetime: data[row].datetime
						});
					}
				}
				res.json(convertedD);
			});
		}
		getTeachers(function(err, data) {
			getMeeting(data, function(err, data) {
				res.json(data);
			});
		});
	});

	gc.get(prefix + '/live-teachers', function(req, res) {
		res.json(require(__dirname + '/site').getLiveTeachers() || []);
	});

	gc.post('/teacher/availability/:action', function(req, res) {
		if (req.user.tutor) {
			if (req.params['action'] == 'true') {
				req.session.teacherAvailability = true;
			} else {
				req.session.teacherAvailability = false;
			}
			res.send(202, {
				success: true
			});
		} else {
			res.status(404, 'Page not found!');
		}
	});



	// ---------------------------------------------------

	/**
	 * Grade feature
	 */

	gc.get(prefix + '/getStudents', function(req, res) {
		if (!req.user) {
			res.send([]);
			return;
		}
		var getUser = function(cb) {
			var userId = req.user['_id'];
			db.UserModel.find({
				_id: userId
			}).exec(function(err, data) {
				if (err) {
					console.log(err);
				}
				cb(null, data);
			});
		}
		var getStudents = function(data, cb) {

			db.UserModel.find({
				_id: {
					$in: data[0].tutorStudents
				}
			}, {
				_id: true,
				firstName: true,
				lastName: true,
			}).exec(function(err, sData) {
				if (err) {
					console.log(err);
				}

				var studData = [];

				for (var ke in sData) {
					studData[studData.length] = {
						_id: sData[ke]._id,
						name: sData[ke].firstName + ' ' + sData[ke].lastName,
					}
				}
				res.json(studData);
			});

		}

		getUser(function(err, data) {
			getStudents(data, function(err, data) {
				res.json(data);
			});
		});
	});

	gc.get(prefix + '/getStudents', function(req, res) {
		if (!req.user) {
			res.send([]);
			return;
		}
		var getUser = function(cb) {
			var userId = req.user['_id'];
			db.UserModel.find({
				_id: userId
			}).exec(function(err, data) {
				if (err) {
					console.log(err);
				}
				cb(null, data);
			});
		}
		var getStudents = function(data, cb) {

			db.UserModel.find({
				_id: {
					$in: data[0].tutorStudents
				}
			}, {
				_id: true,
				firstName: true,
				lastName: true,
			}).exec(function(err, sData) {
				if (err) {
					console.log(err);
				}

				var studData = [];

				for (var ke in sData) {
					studData[studData.length] = {
						_id: sData[ke]._id,
						name: sData[ke].firstName + ' ' + sData[ke].lastName,
					}
				}
				res.json(studData);
			});

		}

		getUser(function(err, data) {
			getStudents(data, function(err, data) {
				res.json(data);
			});
		});
	});


};