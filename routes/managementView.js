'use strict';

const express = require('express');
const router = express.Router();
const mngController = require('../controllers/managementView');
const auth = require('../middleware/auth');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

// For displaying the page
router.get('/', auth.ensureTeacher, mngController.showManagementView);
router.get('/questionaire', auth.ensureTeacher, mngController.showQuestionaire);

// For questionaire
router.get('/add', auth.ensureTeacher, mngController.add);
// TODO proper add
router.post('/add', auth.ensureTeacher, mngController.processAdd);
router.post('/edit/:id([a-f0-9]{24})', auth.ensureTeacher, mngController.edit);
router
    .route('/delete/:id([a-f0-9]{24})')
    .all(
        auth.ensureTeacher, // only teachers can delete questionaires
        csrfProtection // CSRF protection
    )
    .get(mngController.Delete)
    .post(mngController.processDelete);


// For questions
router.post('/question/add/:id([a-f0-9]{24})', auth.ensureTeacher, mngController.addQuestion);
router.post('/question/edit/:id([a-f0-9]{24})', auth.ensureTeacher, mngController.editQuestion);
// First id is for the questionnaire and the second is for the question
router.post('/question/delete/:id_questionaire([a-f0-9]{24})/:id([a-f0-9]{24})', auth.ensureTeacher, mngController.deleteQuestion);
module.exports = router;
