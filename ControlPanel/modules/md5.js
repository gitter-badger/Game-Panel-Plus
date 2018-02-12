const crypto = require('crypto');

module.exports = {
    Get: (s) => {
        return crypto.createHash('md5').update(s).digest('hex');
    },
    Is: function(h, s) {
        return (this.Get(s).toLowerCase() === h.toLowerCase());
    }
}