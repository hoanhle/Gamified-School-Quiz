'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Show start game menu
router.get('/startMenu', auth.ensureAuthenticated, gameController.showStartGame);

// Instruction rules page
router.get('/rules', auth.ensureAuthenticated, gameController.showRules);

// Choose questionaire to start
router.get('/', auth.ensureAuthenticated, gameController.showQuestionaires);

// Delete user (for admins only)
router
    .route('/:id([a-f0-9]{24})')
    .all(
        auth.ensureAdmin // only admins can delete users
    )
    .get(gameController.startGame)
    .post(gameController.handleSubmit);

module.exports = router;
