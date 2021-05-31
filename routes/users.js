const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require('../models/users');
const Stripe = require('stripe');

const userController = require('../utils/userFunctions');
const middleware = require("../middleware");
const { isVerified } = require("../middleware");
const accountSid = "AC168fe5d7f7067f06ca42a2a7098c446f";
const authToken = "e609ca769227a898e5d2c8eef3342279";
const client = require('twilio')(accountSid, authToken);
//users routes 

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/verify', (req, res) => {
    console.log(req.user._id)
    res.render('verify')
})

router.post('/register', middleware.validateUser, async (req, res, next) => {
    const { fName, lName, email, phoneNumber, username, password } = req.body.users;
    const user = new User({ fName, lName, email, phoneNumber, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Registered Successfully, Please verify your email to proceed!');

        client.verify.services('VA758873ecc9e16ade3f935c5b59985c2f')
            .verifications
            .create({ to: req.user.email, channel: 'email' })
            .then(verification => console.log(verification.sid));

        res.redirect('/verify');
    })
})

router.post('/verify', middleware.isLoggedIn, async (req, res) => {
    const { verification_code } = req.body
    try {
        client.verify.services('VA758873ecc9e16ade3f935c5b59985c2f')
            .verificationChecks
            .create({ to: req.user.email, code: verification_code })
            .then(async verification_check => {
                if (verification_check.status === 'approved') {
                    console.log('gud')
                    await User.findByIdAndUpdate(req.user._id, { isVerified: true });
                    req.flash('success', 'Verification Successfully');
                    res.redirect('/');
                } else {
                    req.flash('error', 'Wrong code!');
                    res.redirect('/verify');

                }

            });
    }
    catch (e) {
        console.log(e)
    }
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
router.post("/books/:book_id/issue/:user_id", middleware.isLoggedIn, middleware.isVerified, userController.postIssueBook);

//user -> show return-renew page
router.get("/books/return-renew", middleware.isLoggedIn, middleware.isVerified, userController.getShowRenewReturn);

//user -> renew book
router.post("/books/:book_id/renew", middleware.isLoggedIn, middleware.isVerified, userController.postRenewBook);

// user -> return book

router.post("/books/:book_id/return", middleware.isLoggedIn, middleware.isVerified, userController.postReturnBook);

// user -> delete user account
router.delete("/user/delete-profile", middleware.isLoggedIn, userController.deleteUserAccount);


router.get('/confirm-student', (req, res) => {
    res.render('subscription/confirm-student');
})

router.get('/confirm-standard', (req, res) => {
    res.render('subscription/confirm-standard');
})


router.post('/confirm-student', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isSubscribed: 'pending' });
        req.flash('success', 'Your subscription is now pending payment');
        res.redirect('/');
    } catch (e) {
        req.flash('error', 'Something Went Wrong');
        res.redirect('/subscribe');
    }
})

router.post('/confirm-standard', async (req, res) => {
    res.render('subscription/confirm-standard');
})

module.exports = router;