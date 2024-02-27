const passport = require('passport')
const passportLocal = require('passport-local').Strategy
const admin = require('../models/admin');

passport.use(new passportLocal({
    usernameField : "email"
}, async function(email,password,done){
    let adminData = await admin.findOne({email : email})
    if(adminData){
        // console.log("checking");
        if(adminData.password == password){
            return done(null,adminData)
        }
        else{
            return done(null, false)
        }
    }
    else{
        return done(null, false)
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let checkMail = await admin.findById(id);
    if(checkMail){
        return done(null,checkMail)
    }
    else{
        return done(null,false)
    }
})

passport.setAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
       res.locals.user = req.user;
    }
    next();
    
}

passport.checkAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/admin/')
    }
}

module.exports = passport;