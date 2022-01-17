const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No Estas Logeado');
    res.redirect('/signin');
}

module.exports = helpers;