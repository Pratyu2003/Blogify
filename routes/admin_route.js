const express = require("express");
const admin_route = express();

const body_parser = require('body-parser');
admin_route.use(body_parser.json());
admin_route.use(body_parser.urlencoded({ extended: true }));

const session = require('express-session');
const config = require('../config/config');

admin_route.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
}));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');

const multer = require('multer');
const path = require('path');

//make public folder static that fronted end is accessible when url hits.
admin_route.use(express.static('public'));

//images (file) upload using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const fname = Date.now() + '-' + file.originalname;
        cb(null, fname);
    }
});

const upload = multer({storage:storage});

const admin_controller = require("../controllers/admin_controller");
const bodyParser = require("body-parser");

const admin_login_auth = require('../middlewares/admin_login_auth');


admin_route.get('/about', admin_controller.about);
admin_route.get('/contact', admin_controller.contact);

admin_route.get('/blog-setup', admin_controller.blog_setup);
admin_route.post('/blog-setup', upload.single('blog_image'), admin_controller.blog_setup_save);

admin_route.get('/dashboard', admin_login_auth.is_login, admin_controller.dashboard);

admin_route.get('/create-post', admin_login_auth.is_login, admin_controller.load_post);
admin_route.post('/create-post', admin_login_auth.is_login, admin_controller.add_post);
admin_route.post('/upload-post-image', upload.single('image'), admin_login_auth.is_login, admin_controller.upload_post_image);
admin_route.post('/delete-post', admin_login_auth.is_login, admin_controller.delete_post);

admin_route.get('/edit-post/:id', admin_login_auth.is_login, admin_controller.load_edit_post);
admin_route.post('/update-post', admin_login_auth.is_login, admin_controller.update_post);

module.exports = admin_route;