const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({

    post_limit:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Setting', settingsSchema);