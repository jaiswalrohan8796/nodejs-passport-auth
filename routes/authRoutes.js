const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

//module imports
const User = require("../model/User.js");
require("../utils/passport/passportConfig.js");

//routes
//local auth
router.get("/register", (req, res, next) => {
    res.render("register");
});
router.post("/register", async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const alreadyUser = await User.find({ email: email });
        if (alreadyUser.length > 0) {
            return res.render("register");
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashed,
        });
        await newUser.save();
        console.log("new user registered");
        return res.redirect("/");
    } catch (err) {
        console.log(err);
        return res.redirect("/auth/register");
    }
});
router.post(
    "/local",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true,
    })
);

//oauth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google"),
    (req, res, next) => {
        res.redirect("/");
    }
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook"),
    (req, res, next) => {
        res.redirect("/");
    }
);
//Logout
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});

//exports
module.exports = router;
