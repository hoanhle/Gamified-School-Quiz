'use strict';

const Questionnaire = require('../models/questionnaire');
const db = require('../controllers/db');

module.exports = {
	/**
     * Generate a random question from the questionaire
     */
	async generateRandomQuestion() {
		const questionaire = await Questionnaire.findOne({
			title: 'Count without a calculator'
		});
		const numQuestions = questionaire.questions.length;
		const randomNumber = Math.floor(Math.random() * numQuestions);
		return questionaire.questions[randomNumber];
	},

	/**
     * Generate four option contains 1 true and 3 false
     * @param {Object} question is question object contains title, options, maximum points
     */
	async generateOptions(question) {
		const options = [ ...question.options ];
		const chooseOptions = [];
		let falseOptionNum = 0;
		let trueOptionNum = 0;
		while (falseOptionNum < 3 || trueOptionNum < 1) {
			const randomNumber = Math.floor(Math.random() * options.length);
			const randomOption = options[randomNumber];

			if (randomOption.correctness && trueOptionNum < 1) {
				chooseOptions.push(randomOption);
				trueOptionNum += 1;
			}

			if (!randomOption.correctness && falseOptionNum < 3) {
				chooseOptions.push(randomOption);
				falseOptionNum += 1;
			}
		}

		return chooseOptions;
	},

	/**
     * Generate help for the player
     * @param {string} helpOption value of the help option
     */
	async generateHelp(helpOption) {}
};
