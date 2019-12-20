'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Show start game menu
router.get('/', auth.ensureAuthenticated, gameController.showStartGame);

// Instruction rules page
router.get('/rules', auth.ensureAuthenticated, gameController.showRules);

// Choose questionaire to start
router.get('/choose', auth.ensureAuthenticated, gameController.showQuestionaires);

// Help button clicked
router.post('/start', auth.ensureAuthenticated, gameController.handleSubmit);

module.exports = router;
