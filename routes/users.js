var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.route('/').get(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.find(req.query)
        .exec(function (err, users) {
            if (err) next(err);
            res.json(users);
        });
});

router.route('/:userId/portfolio')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId)
            .exec(function (err, user) {
                if (err) next (err);
                res.json(user.portifolio);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) next (err);
            user.portifolio.push(req.body);
            user.save(function (err, user) {
                if (err) next(err);
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) next(err);
            for (var i = (user.portifolio.length - 1); i >= 0; i--) {
                user.portifolio.id(user.portifolio[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err) next (err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end("Deleted all details of the user's portifolio!");
            });
        });
    });

router.route('/:userId/portifolio/:portifolioId')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId)
            .exec(function (err, user) {
                if (err) next (err);
                res.json(user.portifolio.id(req.params.portifolioId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) next (err);
            if ((user._id != req.decoded._id)||(!Verify.verifyAdmin)) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.peopleRequired.id(req.params.portifolioId).remove();
            user.comments.push(req.body);
            user.save(function (err, user) {
                if (err) next (err);
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) next (err);
            if ((user._id != req.decoded._id)||(!Verify.verifyAdmin)) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.portifolio.id(req.params.portifolioId).remove();
            user.save(function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });
    });

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
            if (err) {
                return res.status(500).json({err: err});
            }
            if(req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if(req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save(function(err,user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({status: 'Registration Successful!'});
                });
            });
        });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }

        console.log("User: ", user);
        req.logIn(user, function(err) {
            if (err) {
                console.log("Error: ", err);
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;