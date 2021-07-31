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
        res.render('uploadFile', { layout: './layouts/uploadFile' })
    })
    .post('/upload', async (req, res) => {

        let user_id = await userid.userid(req.cookies.user)
        let totalspaceused = Number(await totalspaceusedbyuser.totalusedspace(user_id))
        let allowedSpace = Number(await currentallowedspace.getAllowedSpace(user_id))

        if (totalspaceused < allowedSpace) {

            if (req.files) {
                var file = req.files.file
                var filename = file.name

                let user = req.cookies.user;

                var dir = `./public/user-files/${user}`;
                console.log(dir);

                try {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir)
                    }
                } catch (err) {
                    console.error(err)
                }

                filedir = `./public/user-files/${user}/${filename}`
                await file.mv(filedir, (error) => {
                    if (error) {
                        res.end('file could not be created please try again')
                    }
                })

                let fileSizeInMB = file.size / 1000000

                fileHandle.fileEntry(user, filedir, fileSizeInMB)


                res.render('MainUserInterface', { layout: './layouts/MainUserInterface' })

                insertIntoAction.insertIntoAction(user, new Date().toISOString(), 'upload', filename)

            }

        } else {
            res.end('sorry no space')
        }


    }).get('/myfiles', async (req, res) => {
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
            res.render('myfiles', { files: filesArray, layout: './layouts/MainUserInterface' })
        })

    }).get('/myactions', async (req, res) => {

        //render action table for specific client
        let UserActions = await getAction.getAction(req.cookies.user);
        console.log(UserActions);
        res.render('myActions', { files: UserActions })

    }).post('/filedownload', async (req, res) => {
        const filepath = path.join(__dirname, `../public/user-files/${req.cookies.user}/${req.body.file}`);

        if (req.body.action == 'download') {
            res.download(filepath);
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'download', req.body.file)

        } else if (req.body.action == 'delete') {
            let deleteFilePath = `./public/user-files/${req.cookies.user}/${req.body.file}`
            console.log(deleteFilePath);
            console.log(req.cookies.user);

            await fileHandle.filedelete(req.cookies.user, deleteFilePath)
            fs.unlinkSync(filepath);

            //insert delete action to action table
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'delete', req.body.file)
            res.redirect('/file/myfiles')

        }

    })

module.exports = router;