'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {
	async showStartGame(request, response) {
		response.render('game');
	},

	async showRules(request, response) {
		response.render('rules');
	},

	async generateRandomQuestion() {
		const numQuestions = await Questionnaire.countDocuments({});
		const randomNumber = Math.floor(Math.random() * numQuestions);
		return await Questionnaire.find().limit(1).skip(randomNumber);
	},

	async startGame(request, response) {
		const randomQuestion = this.generateRandomQuestion;
		// response.render('gameView', { randomQuestion });

		response.render('gameView', {
			title: 'Select the calculations that result in 40',
			options: [
				{
					option: '25 + 15',
					correctness: true
				},
				{
					option: '10 + 25',
					correctness: false
				},
				{
					option: '66 - 26',
					correctness: false
				},
				{
					option: '27 + 23',
					correctness: false
				}
			]
		});
	},

	async gradeAnswer(request, response) {
		const isCorrect = request.body.option;
		console.log(typeof isCorrect);
		// if correct, render the next random questions
		if (isCorrect === 'true') {
			const randomQuestion = this.generateRandomQuestion;
			response.render('gameView', { randomQuestion });
		} else {
			const points = 2;
			response.render('endGame', { points });
		}
	}
};
