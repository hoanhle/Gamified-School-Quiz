'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

// Start game
router.get('/', auth.ensureAuthenticated, gameController.startGame);

module.exports = router;
