var jwt = require('jsonwebtoken');
var config = require('../../config');

function tokenMiddleware(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) {
        next();
    } else {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('Failed to authenticate token.')
                next();
            }
            
            // if everything good, save to request for use in other routes
            req.userId = decoded && decoded.id;

            next();
        });
    }
}

module.exports = tokenMiddleware;