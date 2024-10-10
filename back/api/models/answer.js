const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
    },
    selectedOption: { 
        type: String, 
        required: true 
    },
    isCorrect: { 
        type: Boolean, 
        required: true 
    }
});

module.exports = answerSchema;