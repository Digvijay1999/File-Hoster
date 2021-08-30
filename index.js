const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const homepage = require('./routers/homepage')
const api = require('./routers/api')
const fileHandler = require('./routers/fileHandler')
const admin = require('./routers/adminHandler')
const layouts = require('express-ejs-layouts')
const cookieparser = require('cookie-parser')
const upload = require('express-fileupload')
const DB = require('./db-config');
const path = require('path');
app.use(upload());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.set('view engine', 'ejs')
app.use(layouts);
app.set('layout', './layouts/universal.ejs')

app.listen(8000, () => {
    console.log('server started at http://localhost:8000');
})

//routings start from here....
app.use('/homepage', homepage);

app.use('/file', fileHandler);

app.use('/admin', admin);

app.use('/api', api, (req, res) => {
    if (!req.cookies.user) {
        return
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('userID');
    res.clearCookie('user').redirect('/homepage')
    
})

app.get('/logout/admin', (req, res) => {
    res.clearCookie('admin').redirect('/admin/login')
})

app.get('*', function (req, res) {
    res.status(404);
    res.end()
    return
});





