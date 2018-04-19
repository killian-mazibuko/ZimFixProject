var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var portfolioSchema = new Schema({
    referenceContact: {
        type: String
    },
    description:  {
        type: String,
        required: true
    },
    duration : {
        type: Number,
        required: true
    },
    reference:  {
        type: String
    },
    referenceContact: {
        type: String
    },
    address: {
        type: String
    },
    photos: [{
        type: String
    }]
}, {
    timestamps: true
});

var User = new Schema({
    username: String,
    password: String,
    dateofbirth: {
        type: Date
    },
    firstname: {
        type: String,
        default: ''
    },
    nationality : {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    occupation: {
        type: String,
        default: ''
    },
    image: {
        type: String
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    }],
    admin: {
        type: Boolean,
        default: false
    },
    portifolio: [portfolioSchema],
    interviewRequests: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    },
    projectsGranted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    }]
});

User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);