const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContributorSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('article', ContributorSchema);