var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var Opportunities = require('../models/opportunities');

var opportunityRouter = express.Router();
opportunityRouter.use(bodyParser.json());

opportunityRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.find(req.query)
            .populate('applications')
            .populate('interviewsRequested')
            .populate('projectOwner')
            .populate('usersGivenTheJob')
            .exec(function (err, opportunity) {
                if (err) next(err);
                res.json(opportunity);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.create(req.body, function (err, opportunity) {
            if (err) throw err;
            var id = opportunity._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Opportunity added with id: ' + id);
        });
    })

    .delete(Verify.verifyAdmin, function (req, res, next) {
        Opportunities.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

opportunityRouter.route('/:opportunityId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId)
            .populate('applications')
            .populate('interviewsRequested')
            .populate('projectOwner')
            .populate('usersGivenTheJob')
            .exec(function (err, opportunity) {
                if (err) throw err;
                res.json(opportunity);
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findByIdAndUpdate(req.params.opportunityId, {
            $set: req.body
        }, {
            new: true
        }, function (err, opportunity) {
            if (err) throw err;
            res.json(opportunity);
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findByIdAndRemove(req.params.opportunityId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

opportunityRouter.route('/:opportunityId/people')

    .get(function (req, res, next) {
        Opportunities.findById(req.params.opportunityId)
            .exec(function (err, opportunity) {
                if (err) throw err;
                res.json(opportunity.peopleRequired);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId, function (err, opportunity) {
            if (err) throw err;
            opportunity.peopleRequired.push(req.body);
            opportunity.save(function (err, opportunity) {
                if (err) throw err;
                res.json(opportunity);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId, function (err, opportunity) {
            if (err) throw err;
            for (var i = (opportunity.peopleRequired.length - 1); i >= 0; i--) {
                opportunity.peopleRequired.id(opportunity.peopleRequired[i]._id).remove();
            }
            opportunity.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all details of people required!');
            });
        });
    });

opportunityRouter.route('/:opportunityId/peopleRequired/:peopleRequiredId')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId)
            .exec(function (err, opportunity) {
                if (err) throw err;
                res.json(opportunity.peopleRequired.id(req.params.peopleRequiredId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId, function (err, opportunity) {
            if (err) throw err;
            if ((user._id != req.decoded._id)||(!Verify.verifyAdmin)) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            opportunity.peopleRequired.id(req.params.peopleRequiredId).remove();
            opportunity.comments.push(req.body);
            opportunity.save(function (err, opportunity) {
                if (err) throw err;
                res.json(opportunity);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Opportunities.findById(req.params.opportunityId, function (err, opportunity) {
            if (err) next (err);
            if ((user._id != req.decoded._id)||(!Verify.verifyAdmin)) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            opportunity.peopleRequired.id(req.params.peopleRequiredId).remove();
            opportunity.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
    });

module.exports = opportunityRouter;