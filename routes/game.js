'use strict';

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

// Start game
router.get('/', gameController.startGame);

module.exports = router;
