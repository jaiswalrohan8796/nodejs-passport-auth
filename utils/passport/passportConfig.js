const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");

//module imports
const User = require("../../model/User.js");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.googleclientID,
            clientSecret: process.env.googleclientSecret,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            User.find({ "oauth.google.googleID": profile.id })
                .then((currentUser) => {
                    if (currentUser.length > 0) {
                        console.log("User already exist");
                        done(null, currentUser[0]);
                    } else {
                        new User({
                            name: profile.displayName,
                            email: profile.email,
                            image: profile.picture,
                            oauth: {
                                google: {
                                    googleID: profile.id,
                                    displayName: profile.displayName,
                                    profile: profile.picture,
                                },
                            },
                        })
                            .save()
                            .then((newUser) => {
                                console.log("new user created" + newUser);
                                done(null, newUser);
                            })
                            .catch((e) => console.log(e));
                    }
                })
                .catch((e) => console.log(e));
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.facebookclientID,
            clientSecret: process.env.facebookclientSecret,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            User.find({ "oauth.facebook.facebookID": profile.id })
                .then((currentUser) => {
                    if (currentUser.length > 0) {
                        done(null, currentUser[0]);
                    } else {
                        new User({
                            name: profile.displayName,
                            email: profile.email,
                            image: profile.picture,
                            oauth: {
                                facebook: {
                                    facebookID: profile.id,
                                    displayName: profile.displayName,
                                    profile: profile.profileUrl,
                                },
                            },
                        })
                            .save()
                            .then((newUser) => {
                                done(null, newUser);
                            })
                            .catch((e) => console.log(e));
                    }
                })
                .catch((e) => console.log(e));
        }
    )
);
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) {
                    return done(null, false, { message: "Server Error" });
                }
                if (!user) {
                    return done(null, false, { message: "Email not found" });
                }
                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return done(err);
                    if (res === false)
                        return done(null, false, {
                            message: "Incorrect password.",
                        });
                    return done(null, user);
                });
            });
        }
    )
);
