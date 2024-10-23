const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

/********/
/* GET */
/********/

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one user
router.get('/:id', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}, (req, res) => {
    res.json(res.user);
});

//todo
//GET /api/users/me: Get current user information

/********/
/* POST */
/********/
 
// Create a new user
router.post('/', async (req, res) => {
    // Check for missing parameters
    const missingParams = [];
    const requiredParams = ['username', 'email', 'password'];

    requiredParams.forEach(param => {        
        if (req.body[param] === undefined) {
            missingParams.push(param);
        }
    });

    if (missingParams.length > 0) {
        return res.status(400).json({
            message: 'Missing parameters',
            missing: missingParams
        });
    }

    // Check if parameters are strings and valid
    const invalidParams = {};
    if (typeof req.body.username !== 'string') {
        invalidParams.username = req.body.username;
    }
    if (typeof req.body.email !== 'string') {
        invalidParams.email = req.body.email;
    }
    if (typeof req.body.password !== 'string') {
        invalidParams.password = req.body.password;
    }

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            message: 'Invalid email format',
            email: req.body.email
        });
    }

    // Check if password is valid
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
            message: 'Password must be at least 12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            password: req.body.password
        });
    }
    
    // Hash password
    try {
        const saltRounds = 10; // Adjust the salt rounds for security vs performance
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: passwordHash
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//todo
//POST /api/users/login: User login
//POST /api/users/logout: User logout
//POST /api/users/forgot-password: Send password reset link
//POST /api/users/reset-password: Reset password

/********/
/* UPDATE */
/********/

// todo
//PATCH /api/users/
///username: Update username

//PATCH /api/users/
///email: Update email (requires password)

//PATCH /api/users/
///password: Update password (requires current password)

//PATCH /api/users/
///profile: Update user profile

//PATCH /api/users/
///deactivate: Deactivate account

//PATCH /api/users/
///reactivate: Reactivate account

/********/
/* DELETE */
/********/

// todo (requires current password)
// Delete user
router.delete('/:id', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User deleted',
            deletedUser: {
                _id: deletedUser._id,
                userId: deletedUser.userId,
                username: deletedUser.username,
                email: deletedUser.email,
                score: deletedUser.score,
                createdAt: deletedUser.createdAt,
                updatedAt: deletedUser.updatedAt,
                __v: deletedUser.__v,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;