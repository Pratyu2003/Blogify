const express = require('express');
const blog_route = express();

blog_route.set('view engine', 'ejs');
blog_route.set('views', './views');

blog_route.use(express.static('public'));

const blog_controller = require('../controllers/blog_controller');

blog_route.get('/', blog_controller.load_blog);
blog_route.get('/post/:id', blog_controller.load_post);

blog_route.post('/add-comment', blog_controller.add_comment);

blog_route.post('/do-reply', blog_controller.do_reply);

module.exports = blog_route;