const express = require('express');
const app = express();
const router = express.Router();
const manageuser = require('../controllers/Admin/manageuser');
const deleteuser = require('../controllers/Admin/deleteuser');
const getuseractions = require('../controllers/Admin/getAllUserActivities');
const getalluserusage = require('../controllers/Admin/getalluserusage');
const gettotalspaceusedbyuser = require('../controllers/Admin/gettotalspaceusedbyuser');
const userupdate = require('../controllers/Admin/updateuser');
const fileHandle = require('../controllers/UserFileEntryToDB')
const DB = require('../db-config');
const fs = require('fs');

const path = require('path');
const usersandfiles = require('../controllers/Admin/getAllUsersFiles')

//admin router here i.e. manage user, usage,activities and all

router
    .get('/', (req, res) => {

        let dir = path.join(`${__dirname}`, `../views/admin/adminHomePage.ejs`)
        res.render(dir)

    })
    .get('/manageuser', async (req, res) => {

        let dir = path.join(`${__dirname}`, `../views/admin/manageuser.ejs`)
        let AllUsers = await manageuser.users()
        res.render(dir, { AllUsers: AllUsers })

    }).post('/updateuser', async (req, res) => {


        if (req.body.active == 'active') {

            await userupdate.deactivateUser(req.body.user_id);
            res.redirect('/admin/manageuser')


        } else if (req.body.inactive == 'inactive') {

            await userupdate.activateUser(req.body.user_id)
            res.redirect('admin/manageuser')


        }
        //update user page

    }).post('/deleteuser', async (req, res) => {

        let username = req.body.username

        deleteuser.deleteuser(username)
        res.end('/admin/manageuser')
        //delete user and redirect to admin page
    })
    .get('/useractivities', async (req, res) => {

        let useraction = await getuseractions.getAllUser()
        let dir = path.join(`${__dirname}`, `../views/admin/useractivities.ejs`)
        console.log(dir);
        res.render(dir, { useraction: useraction });

    }).get('/userStorage', async (req, res) => {
        let storage = await getalluserusage.usage()
        let dir = path.join(`${__dirname}`, `../views/admin/userStorage.ejs`)
        res.render(dir, { userUsage: storage })
    }).post('/userStorage', async (req, res) => {

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
            console.log(spaceUsed);
            let newallowedspace = `UPDATE user_storagespace SET space = '${spaceUsed}' WHERE user_id = '${req.body.user_id}' `
            await DB.executeQuery(newallowedspace)
            res.redirect('/admin/userStorage')
        }
    }).get('/userfiles', async (req, res) => {

        let userfiles = await usersandfiles.usersandfiles();
        console.log(userfiles);


        let dir = path.join(`${__dirname}`, `../views/admin/userfiles.ejs`)
        res.render(dir, { userfiles })

    }).post('/userfiles', async (req, res) => {


        const filepath = path.join(__dirname, `../public/user-files/${req.body.username}/${req.body.filename}`);



        if (req.body.action == 'download') {

            res.download(filepath);

        } else if (req.body.action == 'delete') {

            let deletedir = `./public/user-files/${req.body.username}/${req.body.filename}`
            await fileHandle.filedelete(req.body.username, deletedir)
            fs.unlinkSync(filepath);
            res.redirect('/admin/userfiles')

        }


    })

module.exports = router;