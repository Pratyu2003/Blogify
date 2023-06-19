const Post = require('../models/post_model');
const { ObjectId } = require('mongodb');
const config = require('../config/config');
const nodemailer = require('nodemailer');

const send_comment_mail = async (name, email, post_id) => {
    try {

        const transporter = nodemailer.createTransport(
            {
                host: 'smtp-gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: config.email_user,
                    pass:config.email_password
                }
            }
        );

        const mail_options = {
            from: 'BMS',
            to: email,
            subject: 'New Reply',
            html: '<p>'+name+', has replied to your comment <a href = "http://localhost:3000/post/'+ post_id+'"> Read your replies </a></p>'
        }

        transporter.sendMail(mail_options, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:-", info.response);
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}

const load_blog = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('blog', {posts:posts});
    } catch (error) {
        console.log(error.message);
    }
}

const load_post = async (req, res) => {
    try {
        const post = await Post.findOne({ "_id": req.params.id });
        res.render('post', {post:post});
    } catch (error) {
        console.log(error.message);
    }
}

const add_comment = async (req, res) => {
    try {

        var post_id = req.body.post_id;
        var username = req.body.username;
        var comment = req.body.comment;
        var email = req.body.email;

        var comment_id = new ObjectId();

        await Post.findByIdAndUpdate({ _id: post_id }, {
            $push: {
                "comments":
                {
                    _id: comment_id,
                    email: email,
                    username: username,
                    comment: comment
                }
            }
        });

        res.status(200).send({success: true, message: 'Comment added!', _id : comment_id});

    } catch (error) {
        res.status(200).send({success: false, message: error.message});
    }
}

const do_reply = async (req, res) => {
    try {
        var reply_id = new ObjectId();
        await Post.updateOne(
            {
                "_id": new ObjectId(req.body.post_id),
                "comments._id": new ObjectId(req.body.comment_id)
            },
            {
                $push:
                {
                    "comments.$.replies": { _id: reply_id, name: req.body.name, reply: req.body.reply }
                }
            }
        );

        send_comment_mail(req.body.name, req.body.comment_email, req.body.post_id);
        res.status(200).send(
            {
                success: true,
                message: "Reply added!",
                _id: reply_id
            }
        );


    } catch (error) {
        res.status(200).send({success: false, message: error.message});
    }
}
module.exports = {
    load_blog,
    load_post,
    add_comment,
    do_reply,
}