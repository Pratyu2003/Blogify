const express = require("express");
const user_route = express();

const body_parser = require('body-parser');
user_route.use(body_parser.json());
user_route.use(body_parser.urlencoded({ extended: true }));

const session = require('express-session');
const config = require('../config/config');

user_route.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
}));


user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const user_controller = require('../controllers/user_controller');

const admin_login_auth = require('../middlewares/admin_login_auth');


user_route.get('/login', admin_login_auth.is_logout, user_controller.load_login);
user_route.post('/login', user_controller.verify_login);

user_route.get('/logout', admin_login_auth.is_login, user_controller.logout);


user_route.get('/profile', user_controller.profile);

user_route.get('/forget-password', admin_login_auth.is_logout, user_controller.forget_password);
user_route.post('/forget-password', user_controller.forget_password_verify);

user_route.get('/reset-password', admin_login_auth.is_logout, user_controller.reset_password_load);
user_route.post('/reset-password', user_controller.reset_password);


module.exports = user_route;