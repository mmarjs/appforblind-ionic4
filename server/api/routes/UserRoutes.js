'use strict';

module.exports = function (app) {
    const Controller = require('../controllers/UserController');

    app.route('/login')
        .post(Controller.login);
    
    app.route('/user/me')
        .get(Controller.getUserData);
};
