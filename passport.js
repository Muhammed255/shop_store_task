const LocalStartegy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
	//Local Strategy
	passport.use(new LocalStartegy(function(username, password, done){
		//Match Username
		let query = {Username: username};
		User.findOne(query, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'No User Found'});
			}

			//Match Password
			bcrypt.compare(password, user.Password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Wrong Password'});
				}
			});
		});
	}));

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
}