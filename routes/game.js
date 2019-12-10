'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Show start game menu
router.get('/', auth.ensureAuthenticated, gameController.showStartGame);

// Instruction rules page
router.post('/rules', auth.ensureAuthenticated, gameController.showRules);

module.exports = router;
