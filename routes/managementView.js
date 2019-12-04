'use strict';

const express = require('express');
const router = express.Router();
const mngController = require('../controllers/managementView');

router.get('/', mngController.showManagementView);
// no posts
//router.post('/', mngController.gradeExercise);

module.exports = router;
