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
const usedAndAllowedSpace = require('../controllers/usedSpaceAndAllowedSpace');
const { getRole } = require('../controllers/getRole');

app.use(express.static('public'))

router
    .get('/upload', async (req, res) => {
        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }
        try {
            let user = req.cookies.user
            let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);
            res.render('uploadFile', { user: user, storageSpace: storageSpace, layout: './layouts/MainUserInterface' })
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
            console.log(`Attempting to upload user = ` + req.cookies.user);

            if(req.files == null){
                res.end();
            }

            var file = req.files.file
            let fileSizeInMB = file.size / 1000000
            let user_id = req.cookies.userID
            let totalspaceused = Number(await totalspaceusedbyuser.totalusedspace(user_id))
            let allowedSpace = Number(await currentallowedspace.getAllowedSpace(user_id))
            let spaceLeft = allowedSpace - totalspaceused;
            if (totalspaceused < allowedSpace) {
                if (fileSizeInMB < spaceLeft) {
                    if (req.files) {
                        var filename = file.name
                        let user = req.cookies.user;
                        console.log("current directory for fileHandler is " + __dirname);

                        //current directory for fileHandler is C:\Users\diguy\Desktop\git\file-handler\routers
                        const dir = path.join(__dirname, `../public/user-files/${user}`);

                        if (!fs.existsSync(dir)) {
                            console.log("creating dir");
                            await fs.mkdirSync(dir, { recursive: true });
                        }

                        // let filedir = `../public/user-files/${user}/${filename}`
                        const filedir = path.join(__dirname, `../`,`public/user-files/${user}`, `${filename}`);

                        console.log("path to move file is " + filedir);

                        try {
                            await file.mv(filedir, (error) => {
                                if (error) {
                                    res.end('file could not be created please try again')
                                    throw "error occurred while moving file to users folder "
                                }
                            })
                        } catch (error) {
                            console.log(error);
                        }

                        await fileHandle.fileEntry(user, filedir, fileSizeInMB, filename)
                        await insertIntoAction.insertIntoAction(user, new Date().toISOString(), 'upload', filename)
                        //{ allowedSpace: '10', usedSpace: '0.485477' }
                        let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);
                        res.redirect(`/file/filemanager/?username=${user}`)
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
        fs.readdir(directoryPath, async function (err, files) {
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
            let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);
            res.render('myfiles', { files: filesArray, storageSpace: storageSpace, user: user, layout: './layouts/MainUserInterface' })
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
        let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);
        res.render('myActions', { user: user, storageSpace: storageSpace, files: UserActions, layout: './layouts/MainUserInterface' })

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

            try {     
                await fileHandle.filedelete(req.cookies.user, deleteFilePath)
                fs.unlinkSync(filepath);
            } catch (error) {
                console.log("file was not present in directory while deleting the file");
            }

            //insert delete action to action table
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'delete', req.body.file)
            res.redirect('/file/myfiles')
        }
    }).get('/filemanager', async (req, res) => {

        let role = [];

        try {
            let temprole = await getRole(req.cookies.userID);
            if (temprole) {
                role = temprole;
            }
        } catch (error) {
            console.log("error while serving main-user-interface " + error);
            return;
        }
        try {
            if (req.cookies.user) {
                let user = req.cookies.user
                let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);
                res.render('MainUserInterface', { role: role, user: user, storageSpace: storageSpace, layout: './layouts/modular' })
                // 
            } else {
                res.status(403)
                res.end()
            }
        } catch (error) {
            console.log("error while rendering the main user interface");
        }
    })

module.exports = router;