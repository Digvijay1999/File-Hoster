const express = require('express');
const app = express();
const router = express.Router();
const createuser = require('../controllers/createuser');
const loginCredentials = require('../validator/userLogin');
const userSignUp = require('../validator/userForm');
const getID = require('../controllers/getuserid');
const DB = require('../db-config');
const fs = require('fs');
const path = require('path');
const jwtSignToken = require('../controllers/Auth/jwtSignToken')
//session
app.use(express.static('public'))

router
    .get('/', async (req, res) => {
        //renders starting page
        res.render('homepage', { layout: false })
    })
    .get('/register', async (req, res) => {
        //redirect to register user form
        res.render("registrationpage")
    })
    .post('/register', async (req, res) => {
        console.log("recied sign up request");
        let result = userSignUp.userRegisterValidation(req.body)

        if (result.error) {
            res.end(result.error.message)
            console.log(result);
            return
        }
        //create new user and gets the user id for session creation
        try {
            let user_id = await createuser.createUser(req.body)
        } catch (error) {
            console.log(error);
            res.end("error occurred")
            return;
        }

        let jwtToken = jwtSignToken({ "username": `${req.body.username.trim()}`, "userID": user_id })
        res.cookie("token", jwtToken)

        const dir = path.join(__dirname, `./public/user-files/digu`);

        if (!fs.existsSync(dir)) {
            console.log("creating dir");
            fs.mkdirSync(dir, { recursive: true });
        }

        res.redirect(`/file/filemanager/?username=${req.body.username}`)

        console.log('user created');

    })
    .post('/login', async (req, res) => {
        //jwt

        console.log("login page hit");

        let result = await loginCredentials.validateLoginDetails(req.body)

        if (result.error) {
            res.end(result.error.message)
            return
        }
        //login here, create session , sent to next page
        let loginquery = `SELECT * FROM user_credentials WHERE username = '${req.body.username}' `
        var login_credential;
        try {
            login_credential = await DB.executeQuery(loginquery)
        } catch (error) {
            console.log("error while retrieving info from user_credentials table(database error)");
        }

        if (login_credential[0].access) {
            //check if user have access or not if does then login if not then redirect to login page
            if (login_credential.length && login_credential[0].userpassword == req.body.userpassword) {
                const userID = await getID.userid(req.body.username);
                // res.render('MainUserInterface', { layout: './layouts/MainUserInterface' })
                let jwtToken = jwtSignToken({ "username": req.body.username, "userID": userID })
                res.cookie("token", jwtToken)
                res.redirect(`/file/filemanager/?username=${req.body.username}`)
            }
        } else {
            res.sent(`oops, you don't have access to this page sorry`)
        }
    })

module.exports = router;