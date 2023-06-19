const { error } = require("console");
const blog_setting = require("../models/blog_setting_model");

const is_blog = async (req, res, next) => {
    try {
        const flag = await blog_setting.find({});
        
        if (flag.length == 0 && req.originalUrl != "/blog-setup") {
            res.redirect('/blog-setup');
        }
        else {
            next();
        }

    } catch (eroor) {
        console.log(error.message);
    }
};

module.exports = {
    is_blog
}