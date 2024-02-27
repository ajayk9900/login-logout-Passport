const admin = require('../models/admin');
const path = require('path');
const fs = require("fs");

const nodemailer = require('nodemailer');
const adminData = require('../models/admin');

module.exports.login = async (req, res) => {
    try {
        let captcha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let capValue = '';

        for (var i = 0; i < 5; i++) {
            capValue += captcha.charAt(Math.random() * captcha.length);
        }
        console.log(capValue);
        res.cookie('captchaCode', capValue);
        return res.render('login', {
            'captchaOtp': capValue
        });
    }
    catch (err) {
        console.log('Something wrong', err);
        return res.redirect('back');
    }
}

module.exports.signIn = async (req, res) => {
    try {
        console.log(req.cookies.captchaCode);
        if (req.cookies.captchaCode == req.body.captcha) {
            console.log('captch match');
            req.flashMsg('success', 'Login Successfully..');
            return res.redirect('/admin/dashboard');
        }
        else {
            console.log('captch not match');
            return res.redirect('/admin/')
        }
    }
    catch (err) {
        console.log('Something wrong', err);
        return res.redirect('back')
    }
}

// module.exports.logout = async(req,res)=>{
//     res.clearCookie('admin')
//     return res.redirect('/admin');
// }

module.exports.dashboard = async (req, res) => {
    // console.log(req.user);
    return res.render('dashboard');
}

module.exports.add_admin = async (req, res) => {

    return res.render('add_admin')
}

module.exports.viewAdminData = async (req, res) => {

    let data = await admin.find({})
    return res.render('view_admin', {
        adminInfo: data,

    });

}

module.exports.insertAdminData = async (req, res) => {
    // console.log(req.file);
    // console.log(req.body);
    try {
        let imagePath = '';
        req.body.name = req.body.fname + " " + req.body.lname;
        if (req.file) {
            imagePath = admin.adminImgPath + "/" + req.file.filename;
        }
        req.body.adminImage = imagePath;
        req.body.isActive = true;
        req.body.created_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let adminData = await admin.create(req.body);
        if (adminData) {
            console.log("Record Insert Successfully");
            return res.redirect('/admin/viewAdminData');
        }
        else {
            console.log("Record not found");
            return res.redirect('/admin');
        }
    }
    catch (err) {
        console.log("Something Wrong", err);
        return res.redirect('/admin/view_admin');
    }
}

module.exports.deleteRecords = async (req, res) => {
    try {
        let oldData = await admin.findById(req.params.id);
        if (oldData) {
            var oldImage = oldData.adminImage;
            if (oldImage) {
                let FullPath = path.join(__dirname, "..", oldData.adminImage);
                await fs.unlinkSync(FullPath);
            }
        }
        else {
            console.log("Image Path is Worng");
            return res.redirect("back");
        }
        await admin.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.updateAdminData = async (req, res) => {
    let record = await admin.findById(req.params.id);
    return res.render("update_admin", {
        admin: record,
    });
}

module.exports.EditAdminData = async (req, res) => {
    let oldData = await admin.findById(req.body.EditId);
    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.isActive = true;
    req.body.update_date = new Date().toLocaleString();
    if (req.file) {
        if (oldData.adminImage) {
            let FullPath = path.join(__dirname, "..", oldData.adminImage);
            await fs.unlinkSync(FullPath);
        }
        var imagePath = '';
        imagePath = admin.adminImgPath + "/" + req.file.filename;
        req.body.adminImage = imagePath;
    }
    else {
        req.body.adminImage = imagePath;
    }
    await admin.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/viewAdminData")
}

module.exports.editAdminRecord = async (req, res) => {
    let oldImg = await admin.findById(req.body.editId);
    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.isActive = true;
    req.body.updated_date = new Date().toLocaleString();
    if (req.file) {
        if (oldImg.adminImage) {
            let fullPath = path.join(__dirname, '..', oldImg.adminImage);
            await fs.unlinkSync(fullPath);
        }
        var ImagePath = '';
        ImagePath = admin.adminImgPath + "/" + req.file.filename;
        req.body.adminImage = ImagePath;
    }
    else {
        req.body.adminImage = oldImg.adminImage;
    }
    await admin.findByIdAndUpdate(req.body.editId, req.body);
    return res.redirect('/admin/profile');
}

// view profile of login admin
module.exports.editProfile = async (req, res) => {
    return res.render('profile')
}

module.exports.update = async (req, res) => {
    let data = await admin.find()

    return res.render('update', {
        adminData: data,
    })
}

module.exports.editAdminRecord = async (req, res) => {
    let oldImg = await admin.findById(req.body.editId);
    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.isActive = true;
    req.body.updated_date = new Date().toLocaleString();
    if (req.file) {
        if (oldImg.adminImage) {
            let fullPath = path.join(__dirname, '..', oldImg.adminImage);
            await fs.unlinkSync(fullPath);
        }
        var ImagePath = '';
        ImagePath = admin.adminImgPath + "/" + req.file.filename;
        req.body.adminImage = ImagePath;
    }
    else {
        req.body.adminImage = oldImg.adminImage;
    }
    await admin.findByIdAndUpdate(req.body.editId, req.body);
    return res.redirect('/admin/editProfile');
}

// Change Password
module.exports.changePassword = async (req, res) => {

    return res.render('changePass')
}

module.exports.modifyPass = async (req, res) => {
    try {
        if (req.body.cpass == req.user.password) {
            if (req.body.cpass != req.body.npass) {
                if (req.body.npass == req.body.copass) {
                    let changePass = await admin.findByIdAndUpdate(req.user, {
                        password: req.body.npass
                    })
                    if (changePass) {
                        return res.redirect('/admin/logout')
                    }
                    else {
                        console.log('Password does not change');
                        return res.redirect('back');
                    }
                }
                else {
                    console.log('New and Confirm password are not match...!');
                    return res.redirect('back');
                }
            }
            else {
                console.log('New and Current password are match...!');
                return res.redirect('back');
            }
        }
        else {
            console.log('DB and Current password does not match...!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log('Erroe', err);
        return res.redirect('back')
    }
}

// forget Password
module.exports.forgetPass = async (req, res) => {
    return res.render('forgetPass');
}

module.exports.checkEmail = async (req, res) => {
    // console.log(req.body);
    try {
        let checkEmail = await admin.findOne({ email: req.body.email })
        // console.log(checkEmail);
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "ajaykumawat9981@gmail.com",
                    pass: "vnldxewqswersruu",
                },
            });

            var otp = Math.round(Math.random() * 100000);
            res.cookie('otp', otp);
            res.cookie('email', req.body.email);

            const info = await transporter.sendMail({
                from: 'ajaykumawat9981@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Verification Mail", // Subject line
                text: "Hello world?", // plain text body
                html: `<h1>Verify your email</h1><b>Your OTP : ${otp} </b>`, // html body
            });

            return res.redirect('/admin/OtpPage');


        }
        else {
            console.log("Invalid Email");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.OtpPage = async (req, res) => {
    return res.render('OtpPage');
}

module.exports.checkOtp = async (req, res) => {
    // console.log(req.body);
    // console.log(req.cookies.otp);
    try {
        if (req.body.otp == req.cookies.otp) {
            // res.clearCookie('otp');
            return res.redirect('/admin/forgetAdminPassword');
        }
        else {
            console.log("Otp does not match");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.forgetAdminPassword = async (req, res) => {
    return res.render('resetPass')
}

module.exports.resetPass = async (req, res) => {
    // console.log(req.body);
    try {
        if (req.body.npass == req.body.cpass) {
            let checkEmail = await admin.findOne({ email: req.cookies.email });
            console.log(checkEmail);
            if (checkEmail) {
                // res.clearCookie('email');
                let changePass = admin.findByIdAndUpdate({
                    password: req.body.npass
                })
                console.log(changePass);
                if (changePass) {
                    return res.redirect('/admin/logout');
                }
                else {
                    console.log("Password not update");
                    return res.redirect('back');
                }
            }
            else {
                console.log("Invalid email");
                return res.redirect('back')
            }
        }
        else {
            console.log("New and confirm password are not same");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}