const express = require('express');
const port = 9999;
const path = require('path');

const app = express();
const db = require('./config/mongoose');


const session = require('express-session');
const passport = require('passport')
const passportLocal = require('./config/passportLocal');

const connectFlash = require('connect-flash');
const customFlash = require('./config/customFlash');
app.use(connectFlash());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"assets")));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(session({
    name : 'RNW',
    secret : 'Code',
    resave : true,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000*100*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuth);
app.use(customFlash.setFlash);

app.use('/admin', require('./routes/admin'));

app.listen(port, (err)=>{
    if(err)
        console.log('Something Wrong');

        console.log("Server is connected on port : ", port);
});
