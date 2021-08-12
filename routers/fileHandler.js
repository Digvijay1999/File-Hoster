const express = require('express');
const app = express();
const router = express.Router();
const DB = require('../db-config');
const fs = require('fs');
const { dir } = require('console');
const path = require('path');
const fileHandle = require('../controllers/UserFileEntryToDB')
const getAction = require('../controllers/getActionsOfUser')
const userid = require('../controllers/getuserid')
const insertIntoAction = require('../controllers/insertActionsToDB');
const insertActionsToDB = require('../controllers/insertActionsToDB');
const currentallowedspace = require('../controllers/Admin/getCurrentAllowedSpace');
const totalspaceusedbyuser = require('../controllers/Admin/gettotalspaceusedbyuser')

app.use(express.static('public'))


router
    .get('/upload', (req, res) => {
        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }
        try {
            console.log('');
            let user = req.cookies.user
            res.render('uploadFile', { user: user, layout: './layouts/uploadFile' })
        } catch (error) {
            console.log(error);
            throw error
        }
    })
    .post('/upload', async (req, res) => {
        if (!req.cookies.user) {
            res.status(403)
            res.end()
        }

        try {
            if (!req.cookies) {
                throw 'User session is not configured.'
            }
            console.log(`Attempting to upload the ` + req.cookies.user);
            var file = req.files.file
            let fileSizeInMB = file.size / 1000000
            let user_id = await userid.userid(req.cookies.user)
            let totalspaceused = Number(await totalspaceusedbyuser.totalusedspace(user_id))
            let allowedSpace = Number(await currentallowedspace.getAllowedSpace(user_id))
            let spaceLeft = allowedSpace - totalspaceused;
            if (totalspaceused < allowedSpace) {
                if (fileSizeInMB < spaceLeft) {
                    if (req.files) {
                        var filename = file.name
                        let user = req.cookies.user;
                        var dir = `./public/user-files/${user}`;
                        console.log(dir);
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir)
                        }
                        filedir = `./public/user-files/${user}/${filename}`
                        await file.mv(filedir, (error) => {
                            if (error) {
                                res.end('file could not be created please try again')
                                throw `User file folder is not available to store the data`
                            }
                        })
                        fileHandle.fileEntry(user, filedir, fileSizeInMB, filename)
                        res.render('MainUserInterface', { user: user, layout: './layouts/MainUserInterface' })
                        insertIntoAction.insertIntoAction(user, new Date().toISOString(), 'upload', filename)
                    } else {
                        throw `File is not available to upload`
                    }
                } else if (fileSizeInMB > spaceLeft) {
                    throw ` User don't have enough space to upload this file. Please contact to you admin for space.`
                }

            } else {
                throw ` User don't have enough space to upload this file. Please contact to you admin for space.`
            }
        } catch (error) {
            console.log(error);
            res.end(error)
        }

    }).get('/myfiles', async (req, res) => {

        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }

        let filesArray = []
        const directoryPath = path.join(__dirname, `../public/user-files/${req.cookies.user}`);
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                filesArray.push(file)
            });

            // show files of user
            let user = req.cookies.user
            res.render('myfiles', { files: filesArray, user: user, layout: './layouts/MainUserInterface' })
        })

    }).get('/myactions', async (req, res) => {
        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }
        //render action table for specific client
        let UserActions = await getAction.getAction(req.cookies.user);
        console.log(UserActions);
        let user = req.cookies.user
        res.render('myActions', { user: user, files: UserActions, layout: './layouts/MainUserInterface' })

    }).post('/filedownload', async (req, res) => {

        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }
        const filepath = path.join(__dirname, `../public/user-files/${req.cookies.user}/${req.body.file}`);

        if (req.body.action == 'download') {
            res.download(filepath);
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'download', req.body.file)

        } else if (req.body.action == 'delete') {
            let deleteFilePath = `./public/user-files/${req.cookies.user}/${req.body.file}`

            await fileHandle.filedelete(req.cookies.user, deleteFilePath)
            fs.unlinkSync(filepath);

            //insert delete action to action table
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'delete', req.body.file)
            res.redirect('/file/myfiles')

        }

    }).get('/filemanager', (req, res) => {

        if (req.cookies.user) {
            let user = req.cookies.user
            res.render('MainUserInterface', { user: user, layout: './layouts/MainUserInterface' })
        } else {
            res.status(403)
            res.end()
        }
    })

module.exports = router;