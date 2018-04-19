var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the Interview Schema
var interviewSchema = new Schema({
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    accepted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Interviews = mongoose.model('Interview', interviewSchema);

module.exports = Interviews;