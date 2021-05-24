const multer = require("multer");
const { userRegisterSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const middleware = {};

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/");
};

middleware.validateUser = (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        if (msg == '"users.email" must be a valid email') {
            req.flash('error', 'Please enter a valid email!')
        }
        else if (msg == '""users.phoneNumber"" did not seem to be a phone number') {
            req.flash('error', 'Please enter a valid Jordanian Number!')

        }
        else {
            req.flash('error', msg)

        }


        res.redirect("/");

    } else {
        next();
    }
}

middleware.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "Sorry, this route is allowed for admin only");
    res.redirect("/");
};

middleware.upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

module.exports = middleware;