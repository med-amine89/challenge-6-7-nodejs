const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/UserSchema');


// Register User
router.post('/register', (req, res) => {
    let {
        email,
        password,
        confirm_password
    } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            message: "Password do not much."
        });
    }
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                message: "Email is already registred."
            });
        }
    });
    let newUser = new User({
        password,
        email
    });

    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    message: "User is now registred."
                });
            });
        });
    });
});

// Login User
router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: "Email is not found.",
                success: false
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed."
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user.id
                }, 'RANDOM_TOKEN_SECRET',
                    {
                        expiresIn: "1d"
                    },
                );
                return res.status(200).json({
                    message: "You are Logged In.",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed."
            });
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Authentication User with token
router.get('/profile', passport.authenticate('bearer', { session: false }), (req, res) => {
    res.json(req.user);
});


module.exports = router;     
