const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

const DB = require('../db-config');
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
const verifyToken = require('../controllers/Auth/jwtVerifyToken')
const cookieparser = require('cookie-parser')
const { generateS3URL } = require('../controllers/fileHandlers/s3urlGenerator')
const { getUsersFiles } = require("../controllers/fileHandlers/getFilesNames")
const { getFilesLinkS3 } = require("../controllers/fileHandlers/s3URLgeneratorToDownloadFiles")
const { getFileCount } = require("../controllers/fileHandlers/getFileCountOfUser")

app.use(express.static('public'))
app.use(cookieparser());

router
    .use((req, res, next) => {
        verifyToken(req, res, next)
    })
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

        if (!req.cookies) {
            throw 'User session is not configured.'
        }
        //console.log(`Attempting to upload user = ` + req.cookies.user);

        console.log(req.body);

        let filename = req.body.filename
        let size = parseInt(req.body.size)
        let type = req.body.type

        console.log(filename, size, type);


        let fileSizeInMB = size / 1000000
        let user_id = req.cookies.userID
        let totalspaceused = Number(await totalspaceusedbyuser.totalusedspace(user_id))
        let allowedSpace = Number(await currentallowedspace.getAllowedSpace(user_id))
        let spaceLeft = allowedSpace - totalspaceused;

        console.log(totalspaceused, allowedSpace);

        if (!(totalspaceused < allowedSpace)) {
            res.end(`User don't have enough space to upload this file. Please contact to you admin for space.`)
            console.log("space errror 1");
            return
        }

        console.log(fileSizeInMB, spaceLeft);
        if (!(fileSizeInMB < spaceLeft)) {
            res.end("User don't have enough space to upload this file. Please contact to you admin for space")
            console.log("space errror 2");
            return
        }

        let fileKey = `${req.cookies.user}-${req.cookies.userID}-${filename}`

        //create route to make sure that file was uploaded from user and thrn call this function    

        let url = await generateS3URL(fileKey)
        console.log(url)
        res.send(url)

        //main file upload logic
        //current directory for fileHandler is C:\Users\diguy\Desktop\git\file-handler\routers
        //     const dir = path.join(__dirname, `../public/user-files/${user}`);

        //     if (!fs.existsSync(dir)) {
        //         await fs.mkdirSync(dir, { recursive: true });
        //     }

        //     const filedir = path.join(__dirname, `../`, `public/user-files/${user}`, `${filename}`);

        //     try {
        //         await file.mv(filedir, (error) => {
        //             if (error) {
        //                 throw "error occurred while moving file to users folder ";
        //             }
        //         })
        //     } catch (error) {
        //         res.end("error occurred while storing file please try again");
        //         console.log("error while files was uploading");
        //     }
        //     await fileHandle.fileEntry(user, filedir, fileSizeInMB, filename)
        //     await insertIntoAction.insertIntoAction(user, new Date().toISOString(), 'upload', filename)

        //     res.redirect(`/file/filemanager/?username=${user}`)
    })
    .get('/myfiles', async (req, res) => {

        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }

        //bring file names from DB
        //bring file links from s3 using file name array

        // fs.readdir(directoryPath, async function (err, files) {
        //     //handling error
        //     if (err) {
        //         return console.log('Unable to scan directory: ' + err);
        //     }
        //     //listing all files using forEach
        //     files.forEach(function (file) {
        //         // Do whatever you want to do with the file
        //         filesArray.push(file)
        //     });

        //     // show files of user
        //     let user = req.cookies.user

        let numOfResults = getFileCount(req.cookies.userID)
        const resultPerPage = 10;
        const numberOfPages = Math.ceil(numOfResults / resultPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            res.redirect('/?page=' + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
            res.redirect('/?page=' + encodeURIComponent('1'));
        }

        const startingLimit = (page - 1) * resultPerPage;

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
        if (endingLink < (page + 4)) {
            iterator -= (page + 4) - numberOfPages;
        }

        let arrayOfFiles = await getFilesLinkS3(req.cookies.userID, startingLimit, resultPerPage)

        console.log(arrayOfFiles);

        let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);

        //res.render('myfiles', { data: result, page, iterator, endingLink, numberOfPages });
        res.render('myfiles', { files: arrayOfFiles, page, iterator, endingLink, numberOfPages, storageSpace: storageSpace, user: req.cookies.user, layout: './layouts/MainUserInterface' })
        //})

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
            // let deleteFilePath =  `./public/user-files/${req.cookies.user}/${req.body.file}`;

            let deleteFilePath = path.join(__dirname, `../public/user-files/${req.cookies.user}/${req.body.file}`);

            try {
                console.log("deleting the file");
                await fileHandle.filedelete(req.cookies.user, deleteFilePath)
                fs.unlinkSync(filepath);
            } catch (error) {
                console.log("file was not present in directory while deleting the file");
            }

            //insert delete action to action table
            insertActionsToDB.insertIntoAction(req.cookies.user, new Date().toISOString(), 'delete', req.body.file)
            res.redirect('/file/myfiles')
        }
    })
    .get('/filemanager', async (req, res) => {

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