/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');
const db = require('../models/db');

module.exports = {
    /**
     * Get a Questionnaire corresponding to a given id
     * @params {String} id is the id of the questionare to get
     */
    async getQuestionnaire(id) {
        try {
            return await Questionnaire.findById(id);
        } catch(err) {
            db.handleCriticalError(err);
        }
    },

    /**
     * Get all Questionnaires from the database
     */
    async getAllQuestionnaires() {
        try {
            return await Questionnaire.find({});
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Add a Questionnaire to the database
     * @params {Object} Questionnaire is the JSON object containing Questionnaire info
     */
    async addQuestionnaire(questionnaire) {
        try {
            await Questionnaire.create(questionnaire);
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Update a Questionnaire by replacing it with a new one
     * @params {String} id is the id of the questionare that needs to be updated
     * @params {Object} Questionnaire is the JSON object containing new Questionnaire info
     */
    async updateQuestionnaire(id, questionnaire) {
        try {
            await Questionnaire.findByIdAndUpdate(
                id,
                questionnaire,
                {runValidators: true}
            );
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Delete a Questionnaire corresponding to a given id
     * @params {String} id of the questionare to be deleted
     */
    async deleteQuestionnaire(id) {
        try {
            await Questionnaire.findByIdAndDelete(id, {runValidators: true});
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Delete all Questionnaires
     */
    async deleteAllQuestionnaires() {
        try {
            await Questionnaire.deleteMany({});
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Add a question to an existing questionnaire
     * @params {String} questionnaireId: id of the existing questionnaire
     *         {String} questionTitle: title of the question to be added
     *         {Array} options: array containing options of the question
     *         {Int} maxPoints: maximum number of points that player can get 
     *                          from the question
     */
    async addQuestion(questionnaireId, questionTitle, options, maxPoints) {
        try {
            const questionnaire = await module.exports.getQuestionnaire(questionnaireId);
            const question = {
                title: questionTitle,
                maxPoints: maxPoints,
                options: options
            };
            questionnaire.questions.push(question);
            await module.exports.updateQuestionnaire(questionnaireId, questionnaire);
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Delete a question from an existing questionnaire
     * @params {String} questionnaireId: id of the existing questionnaire
     *         {String} questionId: id of the question to be deleted
     */
    async deleteQuestion(questionnaireId, questionId) {
        try {
            const questionnaire = await module.exports.getQuestionnaire(questionnaireId);
            questionnaire.questions.id(questionId).remove();
            await module.exports.updateQuestionnaire(questionnaireId, questionnaire);
        } catch(err) {
            db.handleCriticalError(err);
        }
    },
    /**
     * Update a question in an existing questionnaire
     * @params {String} questionnaireId: id of the existing questionnaire
     *         {String} questionId: id of the question to be updated
     *         {String} questionTitle: the (possibly new) title of the question
     *         {Array} options: the (possibly new) options of the question
     *         {Int} maxPoints: (possibly new) maximum number of points that player 
     *                          can get from the question
     */
    async updateQuestion(questionnaireId, questionId, questionTitle, options, maxPoints) {
        try {
            await Questionnaire.findOneAndUpdate(
                {'_id': questionnaireId, 'questions._id': questionId},
                {'$set': {
                    'questions.$.title': questionTitle,
                    'questions.$.options': options,
                    'questions.$.maxPoints': maxPoints
                }},
                {runValidators: true}
            );
        } catch(err) {
            db.handleCriticalError(err);
        }
    }
};
