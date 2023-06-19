const blog_setting = require('../models/blog_setting_model');
const User = require('../models/user_model');
const Post = require('../models/post_model');
const bcrypt = require('bcrypt');


const secure_password = async (password) =>{
    try {
        const password_hash = await bcrypt.hash(password, 10);
        return password_hash;
    } catch (error) {
        console.log(error.message)
    }
}

const blog_setup = async (req, res) => {
    try {
        var flag = await blog_setting.find({});
        if (flag.length > 0) {
            res.redirect('/login');
        }
        else {
            res.render('blogsetup');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const blog_setup_save = async (req, res) => {
    try {
        const blog_title = req.body.blog_title;
        const blog_image = req.file.filename;
        const description = req.body.description;
        const email = req.body.email;
        const name = req.body.name;
        const password = await secure_password(req.body.password);

        const blogsetting = new blog_setting({
            blog_title: blog_title,
            blog_logo: blog_image,
            description : description
        });

        await blogsetting.save();

        const user = new User({
            name: name,
            email: email,
            password: password,
            is_admin: 1
        });

        const user_data = await user.save();
        if (user_data) {
            res.redirect('/login');
        }
        else {
            res.render('blogsetup', { message: 'Blog not setup properly'});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const dashboard = async (req, res) => {
    try {
        const all_posts = await Post.find({});
        res.render('admin/dashboard', { posts: all_posts });
    } catch (error) {
        console.log(error.message);
    }
}

const load_post = async (req, res) => {
    try {
        res.render('admin/post_dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const add_post = async (req, res) => {
    try {

        var image = '';

        if (req.body.image !== 'undefined') {
            image = req.body.image;
        }

        const post = new Post(
            {
                title: req.body.title,
                content: req.body.content,
                image: image
            }
        );

        const post_data = await post.save();

        res.send(
            {
                success: true,
                message: "Post added successfully!",
                _id: post_data._id
            }
        );

        // res.render('admin/post_dashboard', {message : 'Post added Successfully!'})
    } catch (error) {
        res.send(
            {
                success: true,
                message: error.message
            }
        );
    }
}

const upload_post_image = async (req, res) => {
    try {
        var image_path = '/images';

        image_path = image_path + '/' + req.file.filename;
        res.send({ success: true, message: 'Post Image Uploaded Successfully!' , path : image_path});

    } catch (error) {
        res.send({ success: false, message: error.message });
    }
}

const delete_post = async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.body.id });
        res.status(200).send({ success: true, message: "Post deleted successfully!" });

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const load_edit_post = async (req, res) => {
    try {
        var post_data = await Post.findOne({ _id: req.params.id });
        res.render('admin/edit-post', { post: post_data });
    } catch (error) {
        console.log(error.message);
    }
}

const update_post = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(
            { _id: req.body.id },
            {  $set:{ title: req.body.title, content: req.body.content } }
        );
        res.status(200).send({ success: true, message: "Post updated successfully!" });

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const about = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.log(error.message);
    }
}

const contact = async (req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    blog_setup,
    blog_setup_save,
    dashboard,
    load_post,
    add_post,
    secure_password, 
    upload_post_image,
    delete_post,
    load_edit_post,
    update_post,
    about,
    contact,
};

