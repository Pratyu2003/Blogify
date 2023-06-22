const user = require('../models/user_model');

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const admin_controller = require('../controllers/admin_controller');
const user_route = require('../routes/user_route');


const send_resetpassword_mail = async (name, email, token) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            
            auth: {
                user: config.email_user,
                pass: config.app_password
            }
        });

        const mail_options = {
            from: config.email_user,
            to: email,
            subject: "Reset Password",
            html:'<p>Hi ' + name + ', Please click here to <a href = "http://localhost:3000/reset-password?token='+token+'">Reset</a> your Password.'
        }

        transport.sendMail(mail_options, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:- ", info.response);
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}

const load_login = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verify_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user_data = await user.findOne({ email: email });

        if (user_data) {
            const flag = await bcrypt.compare(password, user_data.password);
            if (flag) {
                req.session.user_id = user_data._id;
                req.session.is_admin = user_data.is_admin;
                if (user_data.is_admin == 1) {
                    res.redirect('/dashboard');
                }
                else {
                    res.redirect('/profile');
                }
            }
            else {
                res.render('login', {message: "Email and Password is incorrect"});
            }
        }
        else {
            res.render('login', {message: "Email and Password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const profile = async (req, res) => {
    try {
        res.send('profile here');
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

const forget_password = async (req, res) => {
    try {
        res.render('forget-password');
    } catch (error) {
        console.log(error.message);
    }
}

const forget_password_verify = async (req, res) => {
    try {
        const email = req.body.email;
        const user_data = await user.findOne({ email: email });
        
        if (user_data) {
            const random_string = randomstring.generate();
            await user.updateOne({ email: email }, { $set: { token: random_string } });
            send_resetpassword_mail(user_data.name, user_data.email, random_string);

            res.render('forget-password', {message:"Please check you mail to reset your password!"})
        }
        else {
            res.render('forget-password', { message: "User email is incorrect!"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const reset_password_load = async (req, res) => {
    try {
        const token = req.query.token;
        const token_data = await user.findOne({ token: token });

        if (token_data) {
            res.render('reset-password', { user_id: token_data._id });
        }
        else {
            res.render('404');
        }

    } catch (error) {
        console.log(error);
    }
}

const reset_password = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await admin_controller.secure_password(password);
        await user.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: "" } });
        
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    load_login,
    verify_login,
    profile,
    logout,
    forget_password,
    forget_password_verify,
    reset_password_load,
    reset_password
}