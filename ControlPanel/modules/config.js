const ini = require('ini');
const fs = require('fs');
module.exports = () => ini.parse(fs.readFileSync('./config.ini', 'utf-8'));