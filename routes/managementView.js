'use strict';

const express = require('express');
const router = express.Router();
const mngController = require('../controllers/managementView');
const auth = require('../middleware/auth');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

// For displaying the page
router
    .route('/')
    .all (
        auth.ensureTeacher,
        csrfProtection
    )
    .get(mngController.showManagementView);

router
    .route('/questionaire')
    .all(
        auth.ensureTeacher,
        csrfProtection
    )
    .get(mngController.showQuestionaire);

// For questionaire
router
    .route('/add')
    .all(
        auth.ensureTeacher,
        csrfProtection
    )
    .get(mngController.add)
    .post(mngController.processAdd);
    
router
    .route('/edit/:id([a-f0-9]{24})')
    .all(
        auth.ensureTeacher,
        csrfProtection
    )
    .post(mngController.edit);

router
    .route('/delete/:id([a-f0-9]{24})')
    .all(
        auth.ensureTeacher, // only teachers can delete questionaires
        csrfProtection // CSRF protection
    )
    .get(mngController.Delete)
    .post(mngController.processDelete);


// For questions
router
    .route('/question/add/:id([a-f0-9]{24})')
    .all(
        auth.ensureTeacher,
        csrfProtection
    ) 
    .post(mngController.addQuestion);
// For editing questions.

router
    .route('/question/edit/:questionaire([a-f0-9]{24})/:question([a-f0-9]{24})')
    .all(
        auth.ensureTeacher,
        csrfProtection 
    )
    .post(mngController.processEditQuestion)
    .get(mngController.editQuestion);
// First id is for the questionnaire and the second is for the question
router.route('/question/delete/:id_questionaire([a-f0-9]{24})/:id([a-f0-9]{24})')
    .all(
        auth.ensureTeacher,
        csrfProtection
    )
    .post(mngController.deleteQuestion);


module.exports = router;
