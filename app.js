//requires
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

//module imports
const authRoutes = require("./routes/authRoutes");

//config
const PORT = process.env.PORT || 3000;
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUnitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//routes
app.get("/", (req, res, next) => {
    if (req.user) {
        res.render("dashboard", { user: req.user });
    } else {
        res.render("login");
    }
});
app.use("/auth", authRoutes);

//server
mongoose
    .connect(process.env.mongodbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(PORT, () => {
            console.log(`listening on port 3000`);
        })
    )
    .catch((e) => console.log(e));
