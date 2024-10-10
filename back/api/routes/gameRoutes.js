const express = require('express');
const router = express.Router();
const Game = require('../models/game');

/*// Get all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().populate('category_id').populate('players.user_id');
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new game
router.post('/', async (req, res) => {
    const game = new Game({
        category_id: req.body.category_id,
        players: req.body.players,
        status: req.body.status
    });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get one game
router.get('/:id', getGame, (req, res) => {
    res.json(res.game);
});

// Update game
router.patch('/:id', getGame, async (req, res) => {
    if (req.body.status !== null) {
        res.game.status = req.body.status;
    }
    if (req.body.players !== null) {
        res.game.players = req.body.players;
    }

    try {
        const updatedGame = await res.game.save();
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete game
router.delete('/:id', getGame, async (req, res) => {
    try {
        await res.game.remove();
        res.json({ message: 'Game deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get game by ID
async function getGame(req, res, next) {
    let game;
    try {
        game = await Game.findById(req.params.id);
        if (game === null) {
            return res.status(404).json({ message: 'Cannot find game' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.game = game;
    next();
}*/

module.exports = router;