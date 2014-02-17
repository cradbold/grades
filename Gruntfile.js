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
		grunt.task.run('adduser:52936cbcf6eb948d4c02b81d:First-1:Last1:stud_unm1:stud1@gmail.com:stud_pwd1:true:false:[]:52ce4495abc7318e0e000007');
		grunt.task.run('adduser:52936cbcf6eb948d4c02b82d:First-2:Last2:stud_unm2:stud2@gmail.com:stud_pwd2:true:false:[]:52ce4495abc7318e0e000007');
		grunt.task.run('adduser:52936cbcf6eb948d4c02b83d:First-3:Last3:stud_unm3:stud3@gmail.com:stud_pwd3:true:false:[]:52ce4495abc7318e0e000007');
		grunt.task.run('adduser:52936cbcf6eb948d4c02b84d:First-4:Last4:stud_unm4:stud4@gmail.com:stud_pwd4:true:false:[]:52ce4495abc7318e0e000007');
		grunt.task.run('adduser:52936cbcf6eb948d4c02b85d:First-5:Last5:stud_unm5:stud5@gmail.com:stud_pwd5:true:false:[]:52ce4495abc7318e0e000007');

		// Teachers
		grunt.task.run('adduser:52ce4495abc7318e0e000006:Conrad:Warmbold:conrad:cradbold@gmail.com:conrad:false:true:["52936cbcf6eb948d4c02b81d","52936cbcf6eb948d4c02b82d","52936cbcf6eb948d4c02b83d","52936cbcf6eb948d4c02b84d","52936cbcf6eb948d4c02b85d"]:false');		

		// Owner
		grunt.task.run('adduser:52ce4495abc7318e0e000007:Conrad:Warmbold:conrad1:cradbold1@gmail.com:conrad:false:false:[]:true');		
	});

	grunt.registerTask('adduser', 'add a user to the database', function(_id, firstName, lastName, username, email, password, student, tutor, tutorStudents, owner) {
		
		var user = new db.UserModel({
			_id: _id,
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			password: password,
			student: (student === "true"),
			tutor: (tutor === "true"),
			tutorStudents: JSON.parse(tutorStudents),
			owner: owner,
			address:'',
			photo:'',
			creditCards:''
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