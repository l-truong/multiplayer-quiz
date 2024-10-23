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


/********/
/* POST */
/********/
 
// Create a new user
router.post('/', async (req, res) => {
    // Check for missing parameters
    const missingParams = [];
    const requiredParams = ['username', 'email', 'passwordHash'];

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
    // todo check if email string
    // todo check if password string

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }
    // todo check if email follow rejex > return error 400
    // todo check if password follow number, capital, lower, special > 12 + hash, return error 400
    
    //hash password

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: req.body.passwordHash
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/********/
/* UPDATE */
/********/

// todo
// Update user (beside password)

// todo
// Update user password


/********/
/* DELETE */
/********/

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