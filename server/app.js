const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes");
const userRoutes = require("./routes/user");
const connection = require("./config/database");

const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});
app.use(authRoutes);
app.use(userRoutes);
// console.log(__dirname + "/");
app.use(express.static(__dirname + "/public"));
app.listen(3000);
