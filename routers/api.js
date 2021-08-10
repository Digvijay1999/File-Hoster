const express = require('express');
const app = express();
const router = express.Router();
const CheckUserInDB = require('../controllers/userAndEmailChecker')

router
    .get('/userCheck', async (req, res) => {
        let result = await CheckUserInDB.checker(req.query)
        res.json(result);
    })

module.exports = router


