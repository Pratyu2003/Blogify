# Description:

Blogify is a full-stack web application with user authentication, including blog setup, login, logout, and password reset. 
Registered users can create and set up their own blogs and view all their content on the admin dashboard and can also change Pagination(number of posts per page) settings. 
Readers can comment on posts and reply to comments. 
Readers will receive email notifications for replies to their comments via gmail. 
The web application enables users to perform CRUD operations on their blog content. 
It is implemented using the Model-View-Controller (MVC) architecture to separate concerns. 
The application utilizes the Socket.IO library to facilitate real-time updates on posts and comments.


# How to Setup:

1. Make a `config` folder and add a `config.js` file in it.

2. Paste the following code in the `config.js` file:

    ```javascript
    const session_secret = "";
    const email_user = "";
    const app_password = "";

    module.exports = {
        session_secret,
        app_password,
        email_user
    }
    ```

   Follow the below steps to configure the file:
   
   - Add a secret session key of your choice in `session_secret`.
   - Add your Gmail address in `email_user` to send notifications.
   - Generate an app password for your Gmail account. 
   - Instructions can be found at below link: 
     [link](https://stackoverflow.com/questions/72470777/nodemailer-response-535-5-7-8-username-and-password-not-accepted)
   - Replace `app_password` with the generated app password.

3. Open `index.js` file and locate the following line:

    ```javascript
    mongoose.connect("mongodb://localhost:27017/db_name")
    ```

   Change `db_name` to the desired name of your database.

# How to Run:

1. Run the command `npm install` to install the required dependencies.

2. Start the server by running the command `node index.js`.

3. Open the following URL in a web browser: [http://localhost:3000/](http://localhost:3000/)
