const mongoose = require('mongoose');
const flagSchema = require('./flag');

const questionSchema = new mongoose.Schema({
    questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    questionText: { 
        type: String, 
        required: true 
    },
    options: { 
        type: [String], 
        required: true 
    },
    correctAnswer: { 
        type: String, 
        required: true 
    },
    explanation: { 
        type: String, 
        required: false 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    flags: [ flagSchema ],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

questionSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Question', questionSchema);