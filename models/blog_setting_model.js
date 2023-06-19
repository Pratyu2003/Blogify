const mongoose = require("mongoose");

const blog_setting_schema = mongoose.Schema({
    blog_title: {
        type: String,
        required : true
    },
    blog_logo: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    }
});


module.exports = mongoose.model('blog_setting', blog_setting_schema);