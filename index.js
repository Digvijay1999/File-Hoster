const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const homepage = require('./routers/homepage')
const fileHandler = require('./routers/fileHandler')
const admin = require('./routers/adminHandler')
const layouts = require('express-ejs-layouts')
const cookieparser = require('cookie-parser')
const upload = require('express-fileupload')
const DB = require('./db-config');
app.use(upload());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))

app.set('view engine','ejs')
app.use(layouts);
app.set('layout','./layouts/universal.ejs')

app.listen(8000,() => {
    console.log('server started at http://localhost:8000');
})

//routings start from here....
app.use('/homepage',homepage);

app.use('/file',fileHandler);

app.use('/admin',admin);



