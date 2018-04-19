var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the Leader Schema
var leaderSchema = new Schema({
    abbr: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;