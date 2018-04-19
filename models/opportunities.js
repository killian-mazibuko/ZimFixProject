// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var peopleRequiredSchema = new Schema({
    jobDescription:  {
        type: String,
        required: true
    },
    numberOfPeople:  {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Create the Opportunity Schema
var opportunitySchema = new Schema({
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String
    },
    contactNumber: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        required: true
    },
    interviewsRequested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }],
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    peopleRequired: [peopleRequiredSchema],
    usersGivenTheJob: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

var Opportunities = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunities;