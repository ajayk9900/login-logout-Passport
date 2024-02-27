const express = require('express');
const routs = express.Router();
const admin = require('../models/admin');
const adminController = require('../controller/adminController');

const passport = require("passport");

// view login page
routs.get('/', adminController.login);

// login admin
routs.post('/signIn', passport.authenticate('local', {failureRedirect : '/admin/'}) ,adminController.signIn);

// view dashboard
routs.get('/dashboard', passport.checkAuth, adminController.dashboard);

// logout
routs.get('/logout', async(req,res)=>{
    // res.clearCookie('admin')
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log('something wrong');
                return res.redirect('back');
            }
            else{
                return res.redirect('/admin');
            }
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
});

// routs.get('/logout', adminController.logout);

// insert admin
routs.post('/insertAdminData', passport.checkAuth,admin.adminUploadImage,adminController.insertAdminData);

// Add and view admin
routs.get('/add_admin', passport.checkAuth,adminController.add_admin);
routs.get('/viewAdminData', passport.checkAuth,adminController.viewAdminData);

// Update and edit
routs.get("/updateAdminData/:id", passport.checkAuth,adminController.updateAdminData);
routs.post("/EditAdminData", passport.checkAuth,admin.adminUploadImage,adminController.EditAdminData);

// delete 
routs.get('/deleteRecords/:id', passport.checkAuth,adminController.deleteRecords);

// view profile of login admin
routs.get('/editProfile', passport.checkAuth,adminController.editProfile);

// Update profile
routs.get("/update", passport.checkAuth,adminController.update);
routs.post('/editAdminRecord', passport.checkAuth,admin.adminUploadImage,adminController.editAdminRecord);

// Change password
routs.get('/changePassword', passport.checkAuth, adminController.changePassword);
routs.post('/modifyPass', passport.checkAuth,adminController.modifyPass);


// Forget Pass start

routs.get('/forgetPass', passport.checkAuth,adminController.forgetPass);
routs.post('/checkEmail', passport.checkAuth, adminController.checkEmail);

routs.get('/OtpPage', passport.checkAuth,adminController.OtpPage);
routs.post('/checkOtp', passport.checkAuth,adminController.checkOtp);

routs.get('/forgetAdminPassword', passport.checkAuth, adminController.forgetAdminPassword);
routs.post('/resetPass', passport.checkAuth,adminController.resetPass);

// Forget Pass end

module.exports = routs;