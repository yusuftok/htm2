'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Hatim = mongoose.model('Hatim'),
    Cuz = mongoose.model('Cuz'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function (Hatimler) {

    return {
        /**
         * Find article by id
         */
        hatim: function (req, res, next, id) {
            Hatim.load(id, function (err, hatim) {
                if (err) {
                    console.error(err);
                    return next(err);
                }
                if (!hatim) return next(new Error('Failed to load hatim ' + id));
                req.hatim = hatim;
                next();
            });
        },
        cuz: function (req, res, next, id) {
//            req.cuz=req.hatim.cuzes[id - 1];
            next();
//            Hatim.loadCuz(req.hatim._id,id, function(err, cuz) {
//                if (err){
//                    console.error(err);
//                    return next(err);
//                }
//                if (!cuz) return next(new Error('Failed to load cuz ' + id+ ' of hatim '+req.hatim._id));
//                req.cuz = cuz;
//                next();
//            });
        },
        /**
         * Create an article
         */
        create: function (req, res) {
            var hatim = new Hatim(req.body);
            hatim.organizingUser = req.user;
            hatim.cuzes = new Array(30);
            for (var i = 1; i <= 30; i++) {
                hatim.cuzes[i - 1] = new Cuz();
                hatim.cuzes[i - 1].cuzId = i;
                hatim.cuzes[i - 1].completed = false;
            }

            hatim.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Cannot save the hatim'
                    });
                }

                Hatimler.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/hatimler/' + hatim._id,
                    name: hatim._id
                });

                res.json(hatim);
            });
        },
        /**
         * Update an article
         */
        update: function (req, res) {
            var hatim = req.hatim;

            hatim = _.extend(hatim, req.body);


            hatim.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Cannot update the hatim'
                    });
                }

                Hatimler.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: hatim._id,
                    url: config.hostname + '/hatimler/' + hatim._id
                });

                res.json(hatim);
            });
        },
        updateCuz: function (req, res) {
            function _updateCuz(freeCuz, cuz, hatim) {
                var setObject;
                if (!cuz.completed) {
                    if (freeCuz) {
                        setObject = { "$unset": {"completed": false, "cuzes.$.readingUser": null, "cuzes.$.completed": false}};
                    } else {
                        setObject = { "$set": {"completed": false, "cuzes.$": cuz}}
                    }
                } else {
                    if (freeCuz) {
                        throw Exception('Okuyanı olmayan bir cüz bitmiş olamaz!');
                    } else {
                        setObject = {"completed": true, "$set": {"cuzes.$": cuz}};
                        for (var i = 0; i < 30; i++) {
                            if (!hatim.cuzes[i].completed) {
                                setObject = {"completed": false, "$set": {"cuzes.$": cuz}};
                                break;
                            }
                        }
                    }
                }

                Hatim.findOneAndUpdate({ "_id": hatim._id, "cuzes._id": cuz._id },
                    setObject,
                    {new: true},
                    function (err, doc) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                error: 'Cannot update the cuz:' + hatim._id + ' ' + cuz.cuzId
                            });
                        }
                        hatim = doc;
//                        Hatimler.events.publish({
//                            action: 'updated',
//                            user: {
//                                name: req.user.name
//                            },
//                            name: req.hatim._id + '/' + cuz.cuzId,
//                            url: config.hostname + '/hatimler/' + req.hatim._id + '/' + cuz.cuzId
//                        });
                        Hatim.populate(hatim, {
                                path: 'cuzes.readingUser',
                                model: 'User'
                            },
                            function (err, hatim) {
                                if (err) return callback(err);
                                res.json(hatim);
//                                console.log(hatim); // This object should now be populated accordingly.
//                                return hatim;
                            });
//                    res.json(hatim);
                    });
            }

            var hatim = req.hatim;
            var cuz = hatim.cuzes[req.body.cuzId - 1];
            cuz = _.extend(cuz, req.body);
            if (!req.body.readingUser) {
                cuz = _.omit(cuz, 'readingUser');
                hatim = _updateCuz(true, cuz, hatim);
            } else {
                hatim = _updateCuz(false, cuz, hatim);
            }

//            hatim.cuzes[cuz.cuzId - 1] = cuz;
//            res.json(hatim);
        },

        /**
         * Delete an article
         */
        destroy: function (req, res) {
            var hatim = req.hatim;


            hatim.remove(function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Cannot delete the hatim'
                    });
                }

                Hatimler.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: hatim._id
                });

                res.json(hatim);
            });
        },
        /**
         * Show an article
         */
        show: function (req, res) {

            Hatimler.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.hatim._id,
                url: config.hostname + '/hatimler/' + req.hatim._id
            });

            res.json(req.hatim);
        },

        showCuz: function (req, res) {

            Hatimler.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.cuz._hatimId + '/' + req.cuz._cuzId,
                url: config.hostname + '/hatimler/' + req.cuz._hatimId + '/' + req.cuz._cuzId
            });

            res.json(req.hatim);
        },
        /**
         * List of Articles
         */
        all: function (req, res) {
            var query = req.acl.query('Hatim');
            Hatim.find({}).sort('+completed, -dateCreated').populate('dedicatedUser', 'name username').populate('organizingUser', 'name username').populate({
                path: 'cuzes.readingUser',
                model: 'User'
            }).lean().exec(function (err, hatimler) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Cannot list the hatimler'
                    });
                }
                for (var j = 0; j < hatimler.length; j++) {
                    var unread = 0;
                    var notTaken = 0;
                    var cuzes = hatimler[j].cuzes;
                    for (var i = 0; i < 30; i++) {
                        if (!cuzes[i].readingUser) {
                            notTaken++;
                            unread++;
                        }else if (!cuzes[i].completed) {
                            unread++;
                        }
                    }
                    hatimler[j].unread = unread;
                    hatimler[j].notTaken = notTaken;
                }

                res.json(hatimler)
            });

        }
    };
}