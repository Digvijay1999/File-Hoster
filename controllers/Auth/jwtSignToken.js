var jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function signToken(payLoad) {
    var token = jwt.sign(payLoad, "process.env.JSONsecret", { algorithm: 'RS256', issuer: "File-Hoster", expiresIn: "2 days" });
    return token;
}
