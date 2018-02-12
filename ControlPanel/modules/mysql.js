const hyena = require('hyena');
const connection = require('hyena/lib/mysql');

const config = require('./config')();

module.exports = {
    Connect: () => {
        hyena.connect(`mysql://${config.database.user}@localhost/${config.database.database}`);
    },
    hyena: hyena
}