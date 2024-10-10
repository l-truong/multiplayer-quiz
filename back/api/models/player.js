const mongoose = require('mongoose');
const answerSchema = require('./answer');

const playerSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    score: { 
        type: Number, 
        default: 0 
    },
    answers: [ answerSchema ]
});

module.exports = playerSchema;