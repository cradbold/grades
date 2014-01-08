module.exports = function(gc) {
	
	var getIndex = function(req, res) { 
		res.render('index', {
			user: req.user,
			message : req.session.messages
		});
	};
	
	var postIndex = function(req, res, next) {
		gc.passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.session.messages = [ info.message ];
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
	gc.get('/grades', gc.auth.ensureAuthenticated, getGrades);
	gc.get('/logout', getLogout);
};
