const mongoose = require('mongoose');
const playerSchema = require('./player');

const gameSchema = new mongoose.Schema({
    gameId: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    players: [ playerSchema ],
    status: { 
        type: String, 
        enum: ['waiting', 'ongoing', 'completed'], 
        default: 'waiting' 
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

gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Game', gameSchema);