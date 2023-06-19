const mongoose = require('mongoose');

const post_schema = mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    content: {
        type: String,
        required : true
    },
    image: {
        type: String,
        default: ''
    },
    comments: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Post', post_schema);