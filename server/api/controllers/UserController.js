'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');

exports.login = (req, res) => {
    let { firstName, lastName, email } = req.body;
    const user = new User({
        firstName,
        lastName,
        email
    });

    User.find({ email: user.email }, (err, docs) => {
        //save user if not exist
        if (docs.length === 0) {
            user.save((err, user) => {
                if (err) {
                    return res.send(err);
                }
                try {
                    const token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200).send({ auth: true, token: token });
                } catch (e) {
                    res.status(500).send(e);
                };
            });
        } else {
            const token = jwt.sign({ id: docs[0]._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
}

exports.getUserData = (req, res) => {
    const { userId } = req;

    if (!userId) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    
    User.findById(userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
}
