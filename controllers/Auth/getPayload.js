const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function getPayload(req) {
    try {
        let payload = jwt.verify(req.cookies.token, JSONSecreat, { algorithms: ['RS256'] })
        return JSON.parse(payload)
    } catch (err) {
        return null
    }
}