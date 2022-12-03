const express = require('express');
const app = express();
const router = express.Router();
const CheckUserInDB = require('../controllers/userAndEmailChecker')
const loginCreds = require('../controllers/loginCredChecker')
app.use(express.urlencoded({ extended: false }));
const { storeFilesNames } = require("../controllers/fileHandlers/storeFilesNames")
const verifyToken = require('../controllers/Auth/jwtVerifyToken')
const { deletefile } = require("../controllers/fileHandlers/s3urlToDeleteFile")



const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:8000', "http://127.0.0.1:8000/"],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
router.use(cors(corsOptions));

router.post('/userCheck', async (req, res) => {
    console.log("api request for register page");
    let result = await CheckUserInDB.checker(req.body)
    res.json(result);
    console.log("user checked successfully");
    res.end()
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

router
    .use((req, res, next) => {
        verifyToken(req, res, next)
    })
    .post('/fileuploaded', (req, res) => {
        console.log("printing body");
        let filename = req.body.filename
        let size = req.body.size;
        console.log(filename, size);
        console.log("calling store file names ");
        //why req.cookies.filename and req.cookies.size was not working in below function 
        storeFilesNames(req.cookies.userID, req.cookies.user, `${req.cookies.user}-${req.cookies.userID}-${filename}`, parseInt(size) / 1000000, filename)
        res.end()
    }).post('/deletefile', (req, res) => {
        let result = deletefile(req.cookies.userID, req.cookies.user, req.body.filename)
        if (result) {
            res.status(200)
            res.end()
        } else {
            res.status(202)
            res.end()
        }
    })



module.exports = router


