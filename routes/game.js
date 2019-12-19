'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Show start game menu
router.get('/', auth.ensureAuthenticated, gameController.showStartGame);

// Instruction rules page
router.get('/rules', auth.ensureAuthenticated, gameController.showRules);

// Start the game
router.get('/start', auth.ensureAuthenticated, gameController.startGame);

// Grade answer
router.post('/start', auth.ensureAuthenticated, gameController.gradeAnswer);

// Help button clicked
router.post('/help', auth.ensureAuthenticated, gameController.helpClicked);

module.exports = router;
