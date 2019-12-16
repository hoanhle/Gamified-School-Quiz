'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Show start game menu
router.get('/', auth.ensureAuthenticated, gameController.showStartGame);

// Grade answer
router.post('/start', auth.ensureAuthenticated, gameController.gradeAnswer);

// Instruction rules page
router.get('/rules', auth.ensureAuthenticated, gameController.showRules);

// Start the game
router.get('/start', auth.ensureAuthenticated, gameController.startGame);

module.exports = router;
