const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();

const Config = {
	port: 8080
};

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
	res.render('login');
});

app.listen(Config.port, () => console.log(`Game Panel Plus listening on port ${Config.port}!`));