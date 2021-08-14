const express = require('express');
const app = express();
const router = express.Router();
const manageuser = require('../controllers/Admin/manageuser');
const deleteuser = require('../controllers/Admin/deleteuser');
const getuseractions = require('../controllers/Admin/getAllUserActivities');
const getalluserusage = require('../controllers/Admin/getalluserusage');
const gettotalspaceusedbyuser = require('../controllers/Admin/gettotalspaceusedbyuser');
const userupdate = require('../controllers/Admin/updateuser');
const logincred = require('../controllers/loginCredChecker');
const fileHandle = require('../controllers/UserFileEntryToDB')
app.use(express.urlencoded({extended:false}))
const DB = require('../db-config');
const fs = require('fs');

const path = require('path');
const usersandfiles = require('../controllers/Admin/getAllUsersFiles')


//admin router here i.e. manage user, usage,activities and all

router
    .get('/login', async (req, res) => {

        let dir = path.join(`${__dirname}`, `../views/admin/adminLogin.ejs`)
        res.render(dir)

    }).post('/login', async (req, res) => {
        let userCred = await logincred.checker(req.body)
        //if user exists and has access to application
        if (userCred == '1') {
            let user = req.body.username
            let role = `SELECT role FROM user_information WHERE username = '${user}'`

            let userRole = await DB.executeQuery(role)
              //if user is admin
            if (userRole[0].role == 1) {
                res.cookie('admin',req.body.username.trim())
                res.redirect(`/admin/adminPanel/?user=${req.body.username}`)

            } else {
                let dir = path.join(`${__dirname}`, `../views/admin/adminLogin.ejs`)
                res.render(dir, { errorTemp: 'adminAccessError', layout: './layouts/layout_with_admin_error' })

            }
        } else {

            let dir = path.join(`${__dirname}`, `../views/admin/adminLogin.ejs`)
            res.render(dir, { errorTemp: 'adminLoginError', layout: './layouts/layout_with_admin_error' })
        }
    })

    .get('/manageuser', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        let dir = path.join(`${__dirname}`, `../views/admin/manageuser.ejs`)
        let AllUsers = await manageuser.users()
        console.log('all users for manage user = ');
        for (const key in AllUsers) {
           console.log(AllUsers[key]);
        }
        res.render(dir, { AllUsers: AllUsers, user:req.cookies.admin ,layout:'./layouts/layout_with_navbar_admin.ejs' })

    }).post('/updateuser', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        if (req.body.active == 'active') {

            await userupdate.deactivateUser(req.body.user_id);
            res.redirect('/admin/manageuser')

        } else if (req.body.inactive == 'inactive') {

            await userupdate.activateUser(req.body.user_id)
            res.redirect('/admin/manageuser')
        }
        //update user page
    }).post('/deleteuser', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        let username = req.body.username

        console.log('deleting user ='+ username);

        await deleteuser.deleteuser(username)
        res.redirect('/admin/manageuser')
        //delete user and redirect to admin page
    })
    .get('/useractivities', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        let useraction = await getuseractions.getAllUser()
        let dir = path.join(`${__dirname}`, `../views/admin/useractivities.ejs`)
        res.render(dir, { useraction: useraction, user:req.cookies.admin ,layout:'./layouts/layout_with_navbar_admin.ejs'});

    }).get('/userStorage', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        let storage = await getalluserusage.usage()
        let dir = path.join(`${__dirname}`, `../views/admin/userStorage.ejs`)
        res.render(dir, { userUsage: storage, user:req.cookies.admin ,layout:'./layouts/layout_with_navbar_admin.ejs'})
    }).post('/userStorage', async (req, res) => {

        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        if (req.body.action == 'edit') {

            let storage = getalluserusage.usage()
            storage.then(async (data) => {

                if (data.spaceUsed > req.body.newspace) {
                    res.end('sorry cant set lower space than already used')
                } else {

                    let newallowedspace = `UPDATE user_storagespace SET space = '${req.body.newspace}' WHERE user_id = '${req.body.user_id}' `
                    await DB.executeQuery(newallowedspace)

                    res.redirect('/admin/userStorage')
                }
            })
        } else if (req.body.action == 'stop') {
            let spaceUsed = await gettotalspaceusedbyuser.totalusedspace(req.body.user_id)
            let newallowedspace = `UPDATE user_storagespace SET space = '${spaceUsed}' WHERE user_id = '${req.body.user_id}' `
            await DB.executeQuery(newallowedspace)
            res.redirect('/admin/userStorage')
        }
    }).get('/userfiles', async (req, res) => {


        if (!req.cookies.admin) {
            res.status(403)
            res.end()
        } else {
            let userfiles = await usersandfiles.usersandfiles();
            console.log(userfiles);

            let dir = path.join(`${__dirname}`, `../views/admin/userfiles.ejs`)
            res.render(dir, {user:req.cookies.admin , userfiles ,layout: './layouts/layout_with_navbar_admin.ejs' })
        }


    }).post('/userfiles', async (req, res) => {

        console.log('cookie for userfiles' + req.cookies.admin);
        if (!req.cookies.admin) {
            res.status(403)
            res.end()
            return
        }

        const filepath = path.join(__dirname, `../public/user-files/${req.body.username}/${req.body.filename}`);

        if (req.body.action == 'download') {

            res.download(filepath);

        } else if (req.body.action == 'delete') {

            let deletedir = `./public/user-files/${req.body.username}/${req.body.filename}`
            await fileHandle.filedelete(req.body.username, deletedir)
            fs.unlinkSync(filepath);
            res.redirect('/admin/userfiles')

        }


    }).get('/adminPanel',(req,res)=>{
        if (!req.cookies.admin) {
            res.send(403)
            res.end()
            return
        }
        console.log(req.cookies.admin);
        let dir = path.join(`${__dirname}`, `../views/admin/adminHomePage.ejs`)
        res.render(dir,{ user:req.cookies.admin , layout : './layouts/layout_with_navbar_admin.ejs'})
    })

module.exports = router;