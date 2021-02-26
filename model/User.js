const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    oauth: {
        google: {
            googleID: String,
            displayName: String,
            profile: String,
        },
        facebook: {
            facebookID: String,
            displayName: String,
            profile: String,
        },
    },
});

module.exports = mongoose.model("User", UserSchema);
