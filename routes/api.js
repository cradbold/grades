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

	gc.post(prefix + '/grade-post', function(req, res) {

		var gradeData = new db.GradeModel({
			name: req.body.name,
			date: req.body.date,
			type: req.body.type,
			continent: req.body.continent,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city
		});

		gradeData.save(function(err) {
			if (err) {
				console.log('Error: ' + err);
				res.send(err);
			} else {

				db.UserModel.find({
					_id: req.body.studentID
				}).exec(function(err, user) {


					var existsGarde = []

					if (user.length !== 0) {

						if (user[0].grades.length != 0) {
							existsGarde = user[0].grades;
						}

						existsGarde.push(gradeData._id.toString());

						db.UserModel.update({
							_id: req.body.studentID
						}, {
							grades: existsGarde
						}).exec(function(err, done) {
							console.log(done);
						});
					}
				});
				res.send("success");
			}
		});
	});

	gc.get(prefix + '/get-student-grade', function(req, res) {

		db.UserModel.find({
			_id: req.query['studId']
		}).exec(function(err, student) {

			db.GradeModel.find({
				_id: {
					$in: student[0].grades
				}
			}).exec(function(err, grades) {
				res.json(grades);
			});

		});
	});

	gc.get(prefix + '/grade/:studId/delete/:id', function(req, res) {
		db.GradeModel.remove({
			_id: req.params.id
		}).exec(function(err, data) {
			db.UserModel.find({
				_id: req.params.studId
			}).exec(function(err, user) {

				var existsGarde = []

				if (user.length !== 0) {

					if (user[0].grades.length != 0) {
						existsGarde = user[0].grades;
					}

					var index = existsGarde.indexOf(req.params.id);
					if (index > -1) {
						existsGarde.splice(index, 1);
					}

					db.UserModel.update({
						_id: req.params.studId
					}, {
						grades: existsGarde
					}).exec(function(err, done) {
						console.log(done);
					});
				}
			});
			res.send("success");
		});
	});

	gc.get(prefix + '/grade/:id/edit', function(req, res) {
		db.GradeModel.find({
			_id: req.params.id
		}).exec(function(err, data) {
			res.send(data);
		});
	});

	gc.post(prefix + '/grade/update', function(req, res) {
		var gradeData = {
			name: req.body.name,
			date: req.body.date,
			type: req.body.type,
			continent: req.body.continent,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city
		};

		db.GradeModel.update({
				_id: req.body.gradeId
			},
			gradeData
		).exec(function(err, done) {
			res.send("success");
		});
	});


	// gc.get('/get-user', function(req, res) {
	// 	res.json(req.user);
	// });

};