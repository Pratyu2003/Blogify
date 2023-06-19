const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Blogify");

const express = require("express");
const app = express();

//http server connected to app server
var http = require('http').createServer(app);
var { Server } = require('socket.io');
var io = new Server(http, {});


const is_blog = require("./middlewares/is_blog");
app.use(is_blog.is_blog);

app.use(express.static('public'));

//for admin routes
const admin_route = require("./routes/admin_route");
app.use('/', admin_route);

//for user routes
const user_route = require("./routes/user_route");
app.use('/', user_route);

//for blog routes
const blog_route = require("./routes/blog_route");
app.use('/', blog_route);

//whenever changes occurs it listens(io)
io.on("connection", function (socket)
{
    console.log("Server is running");

    socket.on("new_post", function (post)
    {
        socket.broadcast.emit("new_post", post);
    });

    socket.on("new_comment", function (comment)
    {
        io.emit("new_comment", comment);
        //socket.broadcast.emit("new_comment", comment);
    });

    socket.on("new_reply", function (reply)
    {
        io.emit("new_reply", reply);
        //socket.broadcast.emit("new_reply", reply);
    });
});

http.listen(3000, function () {
    console.log("server is running"); 
});

// app.listen(3000, function () {
//     console.log("server is running"); 
// });
