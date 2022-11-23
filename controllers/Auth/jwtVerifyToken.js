const jwt = require('jasonwebtoken')

require('dotenv').config()

module.exports = function verifyToken(req, res, next) {
    try {
        let payload = jwt.verify(req.cookies.token, JSONSecreat, { algorithms: ['RS256'] })
        payload = JSON.parse(payload)
        req.cookies.user = payload.username
        req.cookies.userID = payload.userID
        next();
    } catch {
        res.end("please login first")
    }
}