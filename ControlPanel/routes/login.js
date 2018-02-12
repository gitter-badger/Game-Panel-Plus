const _ = require('lodash');
const express = require('express');
const MD5 = require('../modules/md5');
const MySQL = require('../modules/mysql');
const hyena = MySQL.hyena;
const Schema = hyena.Schema;
const crypto = require('crypto');
const router = express.Router();

// Schemas
const userSchema = new Schema({
	id: { type: 'number', required: true },
	username: { type: 'string', required: true },
	password: { type: 'string', requried: true }
});

const sessionSchema = new Schema({
	user: { type: 'User', field: 'user_id', required: true },
	session: { type: 'string', requried: true }
});

const User = hyena.model('User', userSchema);
const Session = hyena.model('Session', sessionSchema);

// Helper Functions
function createSession(username, password){
	return crypto.createHash('md5').update(`${username}:${password}:${new Date() / 1000}`).digest('hex');
}

router.use('/', function(req, res, next){
    if(typeof(req.cookies["session"]) != "undefined" && req.url != "/dashboard"){
        res.redirect("/dashboard");
    } else {
        next();
    }
});

router.get('/', function (req, res) {
	res.render('login');
});

router.post('/', function(req, res){
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({username: username}, (err, user) => {
		if(_.isNil(user)){
			res.clearCookie("session");
			res.redirect("/");
			return;
		}
		if(username == user.username && MD5.Is(user.password, password)){
			const session = createSession(username, password);
			Session.create({
				user: user,
				session: session
			}, () => {
				res.cookie("session", session);
				res.redirect("/dashboard");
			});
		}
	});
});

module.exports = router;