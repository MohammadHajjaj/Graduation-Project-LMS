// importing dependencies
const sharp = require('sharp');
const { uid } = require('uid');
const fs = require('fs');
// importing models
const User = require("../models/users")
const Activity = require("../models/activity")
const Book = require("../models/books")
const Issue = require("../models/issue")
// importing utilities
const deleteImage = require('../utils/delete_image');

// GLOBAL_VARIABLES
const PER_PAGE = 5;

//user -> dashboard
exports.getUserDashboard = async (req, res, next) => {
    const user_id = req.user._id;
    try {

        // fetch user info from db and populate it with related book issue
        const user = await User.findById(user_id);
        if (user.bookIssueInfo.length > 0) {
            const issues = await Issue.find({ "user_id.id": user._id });
            for (let issue of issues) {
                if (issue.book_info.returnDate < Date.now()) {
                    user.violatonFlag = true;
                    user.save();
                    req.flash("warning", "You are flagged for not returning " + issue.book_info.title + " in time");
                    break;
                }
            }
        }

        const activities = await Activity
            .find({ "user_id.id": req.user._id })
            .sort({ _id: -1 })
            .limit(PER_PAGE);

        const activity_count = await Activity.find({ "user_id.id": req.user._id }).countDocuments();

        res.render("user/dashboard", {
            user: user,
            activities: activities,
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// user -> profile
exports.getUserProfile = (req, res, next) => {
    res.render("user/profile");
}

// user -> update/change password
exports.putUpdatePassword = async (req, res, next) => {
    const username = req.user.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.password;

    try {
        const user = await User.findByUsername(username);
        await user.changePassword(oldPassword, newPassword);
        await user.save();

        // logging activity
        const activity = new Activity({
            category: "Update Password",
            user_id: {
                id: req.user._id,
                username: req.user.username,
            },
        });
        await activity.save();

        req.flash("success", "Your password is recently updated. Please log in again to confirm");
        res.redirect("/");
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// user -> update profile
exports.putUpdateUserProfile = async (req, res, next) => {
    try {
        const userUpdateInfo = {
            "fName": req.body.firstName,
            "lName": req.body.lastName,
            "email": req.body.email,
            "phoneNumber": req.body.gender,
            "address": req.body.address,
        }
        await User.findByIdAndUpdate(req.user._id, userUpdateInfo);

        // logging activity
        const activity = new Activity({
            category: "Update Profile",
            user_id: {
                id: req.user._id,
                username: req.user.username,
            }
        });
        await activity.save();

        res.redirect('back');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// upload image
exports.postUploadUserImage = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const user = await User.findById(user_id);

        let imageUrl;
        if (req.file) {
            imageUrl = `${uid()}__${req.file.originalname}`;
            let filename = `images/${imageUrl}`;
            let previousImagePath = `images/${user.image}`;

            const imageExist = fs.existsSync(previousImagePath);
            if (imageExist) {
                deleteImage(previousImagePath);
            }
            await sharp(req.file.path)
                .rotate()
                .resize(500, 500)
                .toFile(filename);

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        } else {
            imageUrl = 'profile.png';
        }

        user.image = imageUrl;
        await user.save();

        const activity = new Activity({
            category: "Upload Photo",
            user_id: {
                id: req.user._id,
                username: user.username,
            }
        });
        await activity.save();

        res.redirect("/user/profile");
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
};

//user -> issue a book
exports.postIssueBook = async (req, res, next) => {
    if (req.user.violationFlag) {
        req.flash("error", "You are flagged for violating rules on returning books. Untill the flag is lifted, You can't issue any books");
        return res.redirect("back");
    }
    if (req.user.isSubscribed === 'none') {
        if (req.user.bookIssueInfo.length >= 3) {
            req.flash("warning", "You can't issue more than 3 books at a time");
            return res.redirect("back");
        }
    } else {
        if (req.user.bookIssueInfo.length >= 5) {
            req.flash("warning", "Student Subscribers cannot issue more than 5 books at a time");
            return res.redirect("back");
        }
    }

    try {
        const book = await Book.findById(req.params.book_id);
        const user = await User.findById(req.params.user_id);

        // issuing a book to the user
        book.stock -= 1;
        const issue = new Issue({
            book_info: {
                id: book._id,
                title: book.title,
                author: book.author,
                ISBN: book.ISBN,
                category: book.category,
                stock: book.stock,
            },
            user_id: {
                id: user._id,
                username: user.username,
            }
        });

        // putting issue record on individual user document
        user.bookIssueInfo.push(book._id);

        // logging the activity
        const activity = new Activity({
            info: {
                id: book._id,
                title: book.title,
            },
            category: "Issue",
            time: {
                id: issue._id,
                issueDate: issue.book_info.issueDate,
                returnDate: issue.book_info.returnDate,
            },
            user_id: {
                id: user._id,
                username: user.username,
            }
        });

        // await ensure to synchronously save all database alteration
        await issue.save();
        await user.save();
        await book.save();
        await activity.save();

        res.redirect(`/book/${book._id}`);
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// user -> show return -renew page
exports.getShowRenewReturn = async (req, res, next) => {
    const user_id = req.user._id;
    try {
        const issue = await Issue.find({ "user_id.id": user_id });
        res.render("user/return-renew", { user: issue });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// user -> renew book working procedure
/*
    1. construct the search object
    2. fetch issues based on search object
    3. increament return date by 14 days set isRenewed = true
    4. Log the activity
    5. save all db alteration
    6. redirect to /books/return-renew
*/
exports.postRenewBook = async (req, res, next) => {
    try {
        const searchObj = {
            "user_id.id": req.user._id,
            "book_info.id": req.params.book_id,
        }
        const issue = await Issue.findOne(searchObj);
        // adding extra 7 days to that issue
        let time = issue.book_info.returnDate.getTime();
        issue.book_info.returnDate = time + 14 * 24 * 60 * 60 * 1000;
        issue.book_info.isRenewed = true;

        // logging the activity
        const activity = new Activity({
            info: {
                id: issue._id,
                title: issue.book_info.title,
            },
            category: "Renew",
            time: {
                id: issue._id,
                issueDate: issue.book_info.issueDate,
                returnDate: issue.book_info.returnDate,
            },
            user_id: {
                id: req.user._id,
                username: req.user.username,
            }
        });

        await activity.save();
        await issue.save();

        res.redirect("/books/return-renew");
    } catch (err) {
        console.log(err);
        return res.redirect("back");

    }
}

// user -> return book working procedure
/*
    1. Find the position of the book to be returned from user.bookIssueInfo
    2. Fetch the book from db and increament its stock by 1
    3. Remove issue record from db
    4. Pop bookIssueInfo from user by position
    5. Log the activity
    6. refirect to /books/return-renew
*/
exports.postReturnBook = async (req, res, next) => {
    try {
        // finding the position
        const book_id = req.params.book_id;
        const pos = req.user.bookIssueInfo.indexOf(req.params.book_id);

        // fetching book from db and increament
        const book = await Book.findById(book_id);
        book.stock += 1;
        await book.save();

        // removing issue 
        const issue = await Issue.findOne({ "user_id.id": req.user._id });
        await issue.remove();

        // popping book issue info from user
        req.user.bookIssueInfo.splice(pos, 1);
        await req.user.save();

        // logging the activity
        const activity = new Activity({
            info: {
                id: issue.book_info.id,
                title: issue.book_info.title,
            },
            category: "Return",
            time: {
                id: issue._id,
                issueDate: issue.book_info.issueDate,
                returnDate: issue.book_info.returnDate,
            },
            user_id: {
                id: req.user._id,
                username: req.user.username,
            }
        });
        await activity.save();

        // redirecting
        res.redirect("/books/return-renew");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}


// user -> delete user account
exports.deleteUserAccount = async (req, res, next) => {
    try {
        const user_id = req.user._id;

        const user = await User.findById(user_id);
        await user.remove();

        let imagePath = `images/${user.image}`;
        if (fs.existsSync(imagePath)) {
            deleteImage(imagePath);
        }

        await Issue.deleteMany({ "user_id.id": user_id });
        await Comment.deleteMany({ "author.id": user_id });
        await Activity.deleteMany({ "user_id.id": user_id });

        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}

