const express = require("express")
const router = express.Router()
const passport = require("passport")
// fs = require("fs"),
// path = require("path"),
const middleware = require("../middleware")
const User = require("../models/users")
const Book = require("../models/books")
const Activity = require("../models/activity")
const Issue = require("../models/issue")

// importing controller
const adminController = require('../utils/adminFunctions');

//admin -> dashboard
router.get("/admin", middleware.isAdmin, adminController.getDashboard);

//admin -> find activities of all users on admin dashboard
router.post("/admin", middleware.isAdmin, adminController.postDashboard);

//admin -> delete profile
router.delete("/admin/delete-profile", middleware.isAdmin, adminController.deleteAdminProfile);

//admin book inventory
router.get("/admin/bookInventory/:filter/:value/:page", middleware.isAdmin, adminController.getAdminBookInventory);

// admin -> show searched books
router.post("/admin/bookInventory/:filter/:value/:page", middleware.isAdmin, adminController.postAdminBookInventory);

//admin -> show books to be updated
router.get("/admin/book/update/:book_id", middleware.isAdmin, adminController.getUpdateBook);

//admin -> update book
router.post("/admin/book/update/:book_id", middleware.isAdmin, adminController.postUpdateBook);

//admin -> delete book
router.get("/admin/book/delete/:book_id", middleware.isAdmin, adminController.getDeleteBook);

//admin -> users list 
router.get("/admin/users/:page", middleware.isAdmin, adminController.getUserList);

//admin -> show searched user
router.post("/admin/users/:page", middleware.isAdmin, adminController.postShowSearchedUser);

//admin -> flag/unflag user
router.get("/admin/users/flagged/:user_id", middleware.isAdmin, adminController.getFlagUser);
//admin -> sub/unsub user
router.get("/admin/users/subscribed/:user_id", middleware.isAdmin, adminController.getSubUser);

//admin -> show one user
router.get("/admin/users/profile/:user_id", middleware.isAdmin, adminController.getUserProfile);

//admin -> show all activities of one user
router.get("/admin/users/activities/:user_id", middleware.isAdmin, adminController.getUserAllActivities);

//admin -> show activities by category
router.post("/admin/users/activities/:user_id", middleware.isAdmin, adminController.postShowActivitiesByCategory);

// admin -> delete a user
router.get("/admin/users/delete/:user_id", middleware.isAdmin, adminController.getDeleteUser);

//admin -> add new book
router.get("/admin/books/add", middleware.isAdmin, adminController.getAddNewBook);

router.post("/admin/books/add", middleware.isAdmin, adminController.postAddNewBook);

//admin -> profile
router.get("/admin/profile", middleware.isAdmin, adminController.getAdminProfile);

//admin -> update profile
router.post("/admin/profile", middleware.isAdmin, adminController.postUpdateAdminProfile);

//admin -> update password
router.put("/admin/update-password", middleware.isAdmin, adminController.putUpdateAdminPassword);

//admin Auth

//admin login handler
router.get("/admin/admin-login", adminController.getAdminLoginPage)

router.post("/admin/admin-login", passport.authenticate("local", {
	successRedirect: "/admin",
	failureRedirect: "/auth/admin-login",
}), (req, res) => {
});

//admin logout handler
router.get("/admin/admin-logout", adminController.getAdminLogout);


// admin sign up handler
router.get("/admin/admin-signup", adminController.getAdminSignUp);

router.post("/admin/admin-signup", adminController.postAdminSignUp);


module.exports = router;

