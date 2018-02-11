const express = require('express');
const router = express.Router();

router.use(function(req, res, next){
    if(typeof(req.cookies["session"]) == "undefined"){
        res.clearCookie("session");
        res.redirect("/");
    } else {
        next();
    }
});

router.get('/', function (req, res) {
	res.render('user/dashboard');
});

module.exports = router;