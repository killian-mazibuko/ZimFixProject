var express = require('express');
var leaderRouter  = express.Router();
var Leadership = require('../models/leadership');
var Verify = require('./verify');

leaderRouter.route('/')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Leadership.find({}, function (err, leaders) {
        if (err) next(err);
        res.json(leaders);
    });
})

.post(Verify.verifyAdmin, function(req, res, next){
    Leadership.create(req.body, function (err, leader) {
        if (err) next(err);
        console.log('Leadeship information added!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Leader id: ' + id);
    });
})

.delete(Verify.verifyAdmin, function(req, res, next){
    Leadership.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Leadership.findById(req.params.leaderId, function (err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})

.put(Verify.verifyAdmin, function(req, res, next){
    Leadership.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})

.delete(Verify.verifyAdmin, function(req, res, next){
    Leadership.findByIdAndRemove(req.params.leaderId, function (err, resp) {        
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = leaderRouter;