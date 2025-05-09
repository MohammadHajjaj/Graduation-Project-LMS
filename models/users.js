const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    fName: {
        type: String,
    },
    lName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: String,
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
    isSubscribed: { type: String, default: 'none' },
    isAdmin: { type: Boolean, default: false },
    violationFlag: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
