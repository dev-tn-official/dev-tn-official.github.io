const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');

const register = async (req, res) => {
    // Validate message to ensure that all parameters are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: ''
    });

    user.setPassword(req.body.password);

    try {
        const q = await user.save();

        if (!q) {
            return res
                .status(400)
                .json({ message: 'Unable to register user' });
        } else {
            const token = user.generateJWT();

            return res
                .status(200)
                .json({ token });
        }
    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};

// POST: /login
const login = (req, res) => {
    // Validate message to ensure that email and password are present
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    // Delegate authentication to Passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in authentication process
            return res
                .status(404)
                .json(err);
        }

        if (user) {
            // Authentication succeeded - generate JWT and return to caller
            const token = user.generateJWT();

            return res
                .status(200)
                .json({ token });
        } else {
            // Authentication failed
            return res
                .status(401)
                .json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};