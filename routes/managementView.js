'use strict';

const express = require('express');
const router = express.Router();
const mngController = require('../controllers/managementView');
const auth = require('../middleware/auth')

router.get('/', auth.ensureAdmin, mngController.showManagementView);
// no posts
//router.post('/', mngController.gradeExercise);

module.exports = router;
