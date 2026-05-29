const mongoose = require("mongoose");


const userSchema =new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true /*this is added to make the email unique to one person: two person cant use the same email */
    },
    password: {
        type: String,
        required: true
    },
},
{ timestamps: true, versionkey: false},
);

/* Exporting */
const User = mongoose.model("User", userSchema);

module.exports = User;