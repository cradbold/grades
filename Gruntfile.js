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
		// grunt.task.run('dbdrop');

		// Students
		grunt.task.run('adduser:52ce4495abc7318e0e000001:stud_first1:stud_last1:stud_unm1:stud1@gmail.com:stud_pwd1:true:false:[]');
		grunt.task.run('adduser:52ce4495abc7318e0e000002:stud_first2:stud_last2:stud_unm2:stud2@gmail.com:stud_pwd2:true:false:[]');
		grunt.task.run('adduser:52ce4495abc7318e0e000003:stud_first3:stud_last3:stud_unm3:stud3@gmail.com:stud_pwd3:true:false:[]');
		grunt.task.run('adduser:52ce4495abc7318e0e000004:stud_first4:stud_last4:stud_unm4:stud4@gmail.com:stud_pwd4:true:false:[]');
		grunt.task.run('adduser:52ce4495abc7318e0e000005:stud_first5:stud_last5:stud_unm5:stud5@gmail.com:stud_pwd5:true:false:[]');

		// Teachers
		grunt.task.run('adduser:52ce4495abc7318e0e000006:Conrad:Warmbold:conrad:cradbold@gmail.com:conrad:true:false:["52ce4495abc7318e0e000001","52ce4495abc7318e0e000002","52ce4495abc7318e0e000003","52ce4495abc7318e0e000004","52ce4495abc7318e0e000005"]');		
	});

	grunt.registerTask('adduser', 'add a user to the database', function(_id, firstName, lastName, username, email, password, student, tutor, tutorStudents) {
		
		var user = new db.UserModel({
			_id: _id,
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			password: password,
			student: (student === "true"),
			tutor: (tutor === "true"),
			tutorStudents: JSON.parse(tutorStudents)
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