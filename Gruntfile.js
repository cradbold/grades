var db = require('./db/database');

module.exports = function(grunt) {

	grunt.registerTask('dbdrop', 'drop the database', function() {
		// async mode
		var done = this.async();

		db.mongoose.connection.on('open', function() {
			db.mongoose.connection.db.dropDatabase(function(err) {
				if (err) {
					console.log('Error: ' + err);
					done(false);
				} else {
					console.log('Successfully dropped db');
					db.mongoose.connection.close();
					done();
				}
			});
		});		
	});
	
	grunt.registerTask('dbseed', 'seed the database', function() {
//		grunt.task.run('dbdrop');
		grunt.task.run('adduser:Conrad:Warmbold:conrad:cradbold@gmail.com:conrad:true:true:false:false');
		grunt.task.run('adduser:Jayesh:B:jayesh:jayesh@ymail.com:jayesh:false:false:false:true');
	});

	grunt.registerTask('adduser', 'add a user to the database', function(firstName, lastName, username,
			email, password, student, tutor) {
		var user = new db.UserModel({
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			password: password,
			student: (student === "true"),
			tutor: (tutor === "true")
		});

		// save call is async, put grunt into async mode to work
		var done = this.async();

		user.save(function(err) {
			if (err) {
				console.log('Error: ' + err);
				done(false);
			} else {
				console.log('saved user: ' + user.username);
				done();
			}
		});
	});
};