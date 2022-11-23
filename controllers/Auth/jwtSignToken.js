var jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function signToken(payLoad) {
    var token = jwt.sign(payLoad, "process.env.JSONSecreat", { issuer: "File-Hoster", expiresIn: "2 days" });
    return token;
}
