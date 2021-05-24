const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require('../models/users');
const Stripe = require('stripe');

const userController = require('../utils/userFunctions');
const middleware = require("../middleware");
//users routes 

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', middleware.validateUser, async (req, res, next) => {
    const { fName, lName, email, phoneNumber, username, password } = req.body.users;
    const user = new User({ fName, lName, email, phoneNumber, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Registered Successfully!');
        res.redirect('/');
    })

})



router.post('/login', passport.authenticate('local', {
    failureRedirect: '/', badRequestMessage: 'Missing username or password.',
    failureFlash: true
}), (req, res) => {
    try {
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        req.flash('success', 'Logged In Successfully!');
        res.redirect(redirectUrl);
    }
    catch (e) {
        req.flash('Error', 'Wrong Username Or Password!');

    }
})




router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out!');
    res.redirect('/');
})
// user -> dashboard
router.get("/user/dashboard", middleware.isLoggedIn, userController.getUserDashboard);

// user -> profile
router.get("/user/profile", middleware.isLoggedIn, userController.getUserProfile);

//user -> upload image
router.post("/user/image", middleware.isLoggedIn, userController.postUploadUserImage);

//user -> update password
router.put("/user/update-password", middleware.isLoggedIn, userController.putUpdatePassword);

//user -> update profile
router.put("/user/update-profile", middleware.isLoggedIn, userController.putUpdateUserProfile);

//user -> issue a book
router.post("/books/:book_id/issue/:user_id", middleware.isLoggedIn, userController.postIssueBook);

//user -> show return-renew page
router.get("/books/return-renew", middleware.isLoggedIn, userController.getShowRenewReturn);

//user -> renew book
router.post("/books/:book_id/renew", middleware.isLoggedIn, middleware.isLoggedIn, userController.postRenewBook);

// user -> return book

router.post("/books/:book_id/return", middleware.isLoggedIn, userController.postReturnBook);

// user -> delete user account
router.delete("/user/delete-profile", middleware.isLoggedIn, userController.deleteUserAccount);

module.exports = router;