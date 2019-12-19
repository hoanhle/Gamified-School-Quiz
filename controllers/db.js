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
			const questionnaire = await Questionnaire.findById(id);
			return questionnaire;
		} catch(err) {
			db.handleCriticalError(err);
		}
	},

	/**
	 * Get all Questionnaires from the database
	 */
	async getAllQuestionnaires() {
		try {
			const allQuestionnaires = await Questionnaire.find({});
			return allQuestionnaires
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
			await Questionnaire.findByIdAndDelete(id);
		} catch(err) {
			db.handleCriticalError(err);
		}
	},
	/**
	 * Delete all Questionnaires
	 */
	async deleteAllQuestionnaires() {
		try {
			await Questionnaire.deleteMany({})
		} catch(err) {
			db.handleCriticalError(err);
		}
	},
	/**
	 * Add a question to an existing questionnaire
	 * @params {String} questionnaireId: id of the existing questionnaire
	 *         {String} questionTitle: title of the question to be added
	 *		   {Array} options: array containing options of the question
	 *		   {Int} maxPoints: maximum number of points that player can get 
	 *                          from the question
	 */
	async addQuestion(questionnaireId, questionTitle, options, maxPoints) {
		try {
			let questionnaire = await module.exports.getQuestionnaire(questionnaireId);
			let question = {
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
   * TODO Does work not for some reason
	 */
	async deleteQuestion(questionnaireId, questionId) {
		try {
			let questionnaire = await module.exports.getQuestionnaire(questionnaireId);
			const newQuestions = questionnaire.questions.filter(
				question => question._id != questionId
			);
			questionnaire.questions = newQuestions;
			await module.exports.updateQuestionnaire(questionnaireId, questionnaire);
		} catch(err) {
			db.handleCriticalError(err);
		}
	},
	/**
	 * Update a question in an existing questionnaire
	 * @params {String} questionnaireId: id of the existing questionnaire
	 *         {String} questionId: id of the question to be updated
	 *		   {String} questionTitle: the (possibly new) title of the question
	 *         {Array} options: the (possibly new) options of the question
	 *		   {Int} maxPoints: (possibly new) maximum number of points that player 
	 *                          can get from the question
	 */
	async updateQuestion(questionnaireId, questionId, questionTitle, options, maxPoints) {
		try {
			let questionnaire = await module.exports.getQuestionnaire(questionnaireId);

			let updateIndex = questionnaire.questions.findIndex(question => question._id == questionId);
			questionnaire.questions[updateIndex].questionTitle = questionTitle;
			questionnaire.questions[updateIndex].options = options;
			questionnaire.questions[updateIndex].maxPoints = maxPoints;

			await module.exports.updateQuestionnaire(questionnaireId, questionnaire);
		} catch(err) {
			db.handleCriticalError(err);
		}
	}
}
