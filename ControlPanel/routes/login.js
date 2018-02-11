const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
	res.render('login');
});

router.post('/', function(req, res){
	console.log(req.body);
	res.cookie("session", "123");
	res.redirect("/dashboard");
});

module.exports = router;