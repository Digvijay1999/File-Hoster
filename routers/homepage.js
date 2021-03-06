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
//session
const session = require('express-session');
const MongoStore = require('connect-mongo');
const url = process.env.MONGO_URL;

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
        let result = await userSignUp.userRegisterValidation(req.body)

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
        res.cookie('userID', `${user_id}`)
        res.cookie('user', `${req.body.username.trim()}`)
        req.session.username = `${login_credential[0].username}`;
        req.session.userID = `${login_credential[0].user_id}`;

        const dir = path.join(__dirname, `./public/user-files/digu`);

        if (!fs.existsSync(dir)) {
            console.log("creating dir");
            fs.mkdirSync(dir, { recursive: true });
        }

        res.redirect(`/file/filemanager/?username=${req.body.username}`)

        console.log('user created');

    })
    .use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: url,
                ttl: 24 * 60 * 60 * 1000,
            })
        })
    )
    .post('/login', async (req, res) => {

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
                req.session.username = `${login_credential[0].username}`;
                req.session.userID = `${login_credential[0].user_id}`;
                res.cookie('user', `${login_credential[0].username}`)
                res.cookie('userID', `${userID}`);

                console.log("cookie with session sent to user");
                // res.render('MainUserInterface', { layout: './layouts/MainUserInterface' })
                res.redirect(`/file/filemanager/?username=${req.body.username}`)
            }
        } else {
            res.sent(`oops, you don't have access to this page sorry`)
        }
    })

module.exports = router;