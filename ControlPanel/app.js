const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Config = {
	port: 8080
};

const Routes = {
	login: require('./routes/login'),
	dashboard: require('./routes/dashboard')
};

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Login
app.use('/', Routes.login);

// Dashboard
app.use('/dashboard', Routes.dashboard);

http.listen(Config.port, () => console.log(`Game Panel Plus listening on port ${Config.port}!`));