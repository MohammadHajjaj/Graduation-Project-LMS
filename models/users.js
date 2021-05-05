const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: Number,
    },
    joined: { type: Date, default: Date.now() },
    bookIssueInfo: [
        {
            book_info: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Issue",
                },
            },
        },
    ],
    address: String,
    image: {
        type: String,
        default: "",
    },
    isSubscribed: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    violationFlag: { type: Boolean, default: false },


});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
