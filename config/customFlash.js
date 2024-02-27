module.exports.setFlash = (req, res, next) => {
    res.locals.flashMsg = {
        'success' : req.flash('success'),
        'error' : req.flash('error')
    }
}