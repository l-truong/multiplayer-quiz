const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

categorySchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Category', categorySchema);