const express = require('express');
const app = express();
const db = require('./app/models');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require('path');
const flash = require('connect-flash');
const { validateUser,validateAdmin} = require('./middleware/AuthMiddleware');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());


app.use(express.static('./static'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app','views'));
app.use(
   cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
   })
);


app.use(
  session({
    key: "userId",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
   //  cookie: {
   //    expires: 60 * 60 * 24,
   //  },
  })
);
app.use((req,res,next)=>{
   res.header('Cache-control','no-store');
   next();
})
app.use(flash());

app.use((req, res, next) => {
   res.locals.session = req.session || {};
   next();
 });
const AdminRouter = require("./routes/Admin");
app.use("/", AdminRouter);
const blogPostRouter = require("./routes/BlogPost");
app.use("/post", blogPostRouter);
app.get("/login",(req,res)=>{
   res.render('Login.ejs',{ messages: req.flash('error') });
});
app.get("/",(req,res)=>{
   res.render('Home.ejs',{ messages: req.flash('message') });
});
app.get("/home",(req,res)=>{
   res.render('Home.ejs',{ messages: req.flash('message') });
});
app.get("/signup",(req,res)=>{
   res.render('SignUp.ejs',{ messages: req.flash('error') });
});
app.get("/createpost",validateUser,(req,res)=>{
   res.render('CreatePost.ejs',{message:""});
});
app.get("/updatepost",validateUser,(req,res)=>{
   res.render('UpdatePost.ejs',{message:""});
});
app.get("/post/create",validateUser,(req,res)=>{
   res.render('CreatePost.ejs',{isAuth:req.session.isAuthenticated});
});
app.get("/createuser",validateAdmin,(req,res)=>{
   res.render('CreateUser.ejs',{isAuth:req.session.isAuthenticated});
});
app.get("/cap",(req,res)=>{
   res.render('Captcha.ejs');
});


db.sequelize.sync().then(() => {
   app.listen(3001, () => {
      console.log(`listening to port 3001`);
   });
});
