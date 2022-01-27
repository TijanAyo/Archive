const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    course_code: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('material', MaterialSchema);