const express = require('express');
const app = express();
const router = express.Router();
const CheckUserInDB = require('../controllers/userAndEmailChecker')
const loginCreds = require('../controllers/loginCredChecker')
app.use(express.urlencoded({ extended: false }));

router.post('/userCheck', async (req, res) => {
    console.log("api request for register page");
    let result = await CheckUserInDB.checker(req.body)
    res.json(result);
    res.end
})

router.post('/loginCheck', async (req, res) => {
    console.log("api call for login page for " + req.body.username);
    try {
        let result = await loginCreds.checker(req.body)
        if (result) {
            res.send(result)
            res.end
        }
    } catch (error) {
        res.end("something went wrong, please try again !")
    }

})

module.exports = router


