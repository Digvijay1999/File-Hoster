const express = require('express');
const app = express();
const router = express.Router();
const CheckUserInDB = require('../controllers/userAndEmailChecker')
const loginCreds = require('../controllers/loginCredChecker')
app.use(express.urlencoded({ extended: false }));

router.get('/userCheck', async (req, res) => {
    let result = await CheckUserInDB.checker(req.query)
    res.json(result);
})

router.post('/loginCheck', async (req, res) => {
    let result = await loginCreds.checker(req.body)
    if (result) {
     res.send(result)
    }
})


module.exports = router

