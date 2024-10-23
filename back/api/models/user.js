const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    accountStatus: {
        type: String,
        enum: ['active', 'deactivated', 'suspended'],
        default: 'deactivated'
    },
    passwordResetToken: { 
        type: String 
    },
    passwordResetExpires: { 
        type: Date 
    },
    lastLogin: { 
        type: Date 
    },
    score: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

userSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);