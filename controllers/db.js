/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');
const db = require('../models/db');

module.exports = {
	/**
	 * Get a Questionnaire corresponding to a given title
	 * @params {String} title is the title of the questionare to get
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
	 * @params {String} title is the title of the questionare that needs to be updated
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
	 * Delete a Questionnaire corresponding to a given title
	 * @params {String} title of the questionare to be deleted
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
	}
}