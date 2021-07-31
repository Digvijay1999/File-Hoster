const express = require('express');
const app = express();
const router = express.Router();
const createuser = require('../controllers/createuser');
const DB = require('../db-config');
app.use(express.static('public'))


router
    .get('/', (req, res) => {
        //renders starting page
        res.render('homepage', { layout: false })
    })
    .get('/register', (req, res) => {
        //redirect to register user form
        res.render("registrationpage")
    })
    .post('/register', (req, res) => {
        //create new user and gets the user id for session creation
        let user_id = createuser.createUser(req.body)
        console.log('user created');

    })
    .post('/login', async (req, res) => {

        //login here, create session , sent to next page
        let loginquery = `SELECT username, userpassword,access FROM user_credentials WHERE username = '${req.body.username}' `
        let login_credential = await DB.executeQuery(loginquery)

        console.log(login_credential);
        //[ { username: 'admin', userpassword: 'Digu@1234' } ]

        if (login_credential.length == 0) {
            //user dosent exists
            //user cant sign in
            res.end('user does not exists')

        } else if (login_credential[0].userpassword != req.body.userpassword) {
            //password is wrong
            //user cant sign in
            res.end('please check userid or password')

        } else if (login_credential[0].access) {
            //check if user have access or not if does then login if not then redirect to login page

            if (login_credential.length && login_credential[0].userpassword == req.body.userpassword) {
                //let user sign in 
                //password matched proceed to next page
                //create cookkie with user name and sent to client
                //and then redirect to mainuserinterface
                res.cookie('user', `${login_credential[0].username}`)
                res.render('MainUserInterface', { layout: './layouts/MainUserInterface' })
            }
        } else {
            console.log('user dont have access');
            res.redirect('/login')
        }
    })


module.exports = router;