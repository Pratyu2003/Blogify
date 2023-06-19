const mongoose = require("mongoose");

const user_schema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    is_admin: {
        type: String,
        required : true
    },
    token: {
        type: String,
        default : ''
    }
});

module.exports = mongoose.model('User', user_schema);