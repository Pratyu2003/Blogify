const is_login = async (req, res, next) => {
    try {
        if (req.session.user_id && req.session.is_admin == 1) {}
        else {
            res.redirect('/login');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const is_logout = async (req, res, next) => {
    try {
        if (req.session.user_id && req.session.is_admin == 1) {
            res.redirect('/dashboard');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    is_login,
    is_logout
}