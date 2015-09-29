'use strict';

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && !req.hatim.organizingUser._id.equals(req.user._id)) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

var hasPermissions = function(req, res, next) {
    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
        var permission = req.body.permissions[i];
        if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        };
    };

    next();
};

module.exports = function(Hatim, app, auth) {

    var hatimler = require('../controllers/hatimler')(Hatim);
    app.route('/api/hatimler')
        .get(hatimler.all)
        .post(auth.requiresLogin, hasPermissions, hatimler.create);
    app.route('/api/hatimler/:hatimId')
        .get(auth.isMongoId, hatimler.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, hatimler.update)    
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, hatimler.destroy);

    app.route('/api/hatimler/:hatimId/:cuzId')
        .get(auth.isMongoId, hatimler.showCuz)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, hatimler.updateCuz);
    // Finish with setting up the articleId param
    app.param('hatimId', hatimler.hatim);
    app.param('cuzId', hatimler.cuz);
};
