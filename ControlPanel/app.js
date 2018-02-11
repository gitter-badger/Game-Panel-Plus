const express = require('express');
const app = express();

const Config = {
	port: 8080
};

app.get('/', function (req, res) {
	
});

app.listen(Config.port, () => console.log(`Game Panel Plus listening on port ${Config.port}!`));