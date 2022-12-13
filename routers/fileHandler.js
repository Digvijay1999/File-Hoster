const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

const DB = require('../db-config');
const path = require('path');
const fileHandle = require('../controllers/UserFileEntryToDB')
const getAction = require('../controllers/getActionsOfUser')
const userid = require('../controllers/getuserid')
const { insertIntoAction } = require('../controllers/insertActionsToDB');
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

        let url

        try {
            console.log("calling generateS3URL");
            url = await generateS3URL(fileKey)
            insertIntoAction(req.cookies.user, new Date().toISOString(), "UPLOAD", filename);
        } catch (err) {
            console.log(err)
            res.end()
            return;
        }
        res.send(url)
    })
    .get('/myfiles', async (req, res) => {

        if (!req.cookies.user) {
            res.status(403)
            res.end()
            return
        }



        let numOfResults = await getFileCount(req.cookies.userID)
        console.log("total files " + numOfResults);
        const resultPerPage = 10;
        const numberOfPages = Math.ceil(numOfResults / resultPerPage) == 0 ? 1 : Math.ceil(numOfResults / resultPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;

        if (page > numberOfPages) {
            res.redirect('/?page=' + encodeURIComponent(numberOfPages));
            res.end()
            return;
        } else if (page < 1) {
            res.redirect('/?page=' + encodeURIComponent('1'));
        }

        let arrayOfFiles;
        let iterator
        let endingLink

        //3 -2 -1 0 1 2

        if (numOfResults <= resultPerPage) {
            arrayOfFiles = await getFilesLinkS3(req.cookies.userID, 0, 11)
            iterator = 1;
            endingLink = 1;

        } else {
            const startingLimit = (page - 1) * resultPerPage;

            iterator = (page - 5) < 1 ? 1 : page - 5;
            endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : numberOfPages;
            // if (endingLink < (page + 4)) {
            //     iterator -= (page + 4) - numberOfPages;
            // }
            arrayOfFiles = await getFilesLinkS3(req.cookies.userID, startingLimit, resultPerPage)
        }

        console.log(arrayOfFiles);

        let storageSpace = await usedAndAllowedSpace.getData(req.cookies.userID);

        //res.render('myfiles', { data: result, page, iterator, endingLink, numberOfPages });
        console.log(page, iterator, endingLink, numberOfPages);
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

    }).post('/delete', async (req, res) => {
        console.log("delete file route called");
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
