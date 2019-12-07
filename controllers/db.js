/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');
const db = require('../models/db');

module.exports = {
	/**
	 * Get a Questionnaire corresponding to a given title
	 * @params {String} title is the title of the questionare to get
	 */
	async getQuestionnaire(title) {
		const Questionnaire = await Questionnaire.findOne({title: title}, function(err) {
			if (err) db.handleCriticalError(err);
		});
		return Questionnaire
	}

	/**
	 * Get all Questionnaires from the database
	 */
	async getAllQuestionnaires() {
		const Questionnaires = await Questionnaire.find({}, function (err) {
			if (err) db.handleCriticalError(err);
		});
		return Questionnaires
	}
	/**
	 * Add a Questionnaire to the database
	 * @params {Object} Questionnaire is the JSON object containing Questionnaire info
	 */
	async addQuestionnaire(questionnaire) {
		await Questionnaire.create({questionnaire}, function (err) {
			if (err) db.handleCriticalError(err);
		});
	}
	/**
	 * Update a Questionnaire by replacing it with a new one
	 * @params {String} title is the title of the questionare that needs to be updated
	 * @params {Object} Questionnaire is the JSON object containing new Questionnaire info
	 */
	async updateQuestionnaire(title, questionnaire) {
		await Questionnaire.replaceOne(
			{title: title},
			questionnaire,
			{upsert: true},
			function(err) {
				if (err) db.handleCriticalError(err);
			}
		);
	}
	/**
	 * Delete a Questionnaire corresponding to a given title
	 * @params {String} title of the questionare to be deleted
	 */
	async deleteQuestionnaire(title) {
		await Questionnaire.deleteOne({title: title}, function(err){
			if (err) db.handleCriticalError(err);
		});
	}
	/**
	 * Delete all Questionnaires
	 */
	async deleteAllQuestionnaires() {
		await Questionnaire.deleteMany({}, function(err){
			if (err) db.handleCriticalError(err);
		});
	}
}