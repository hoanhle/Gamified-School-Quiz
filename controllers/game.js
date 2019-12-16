'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {
	async showStartGame(request, response) {
		response.render('game');
	},

	async showRules(request, response) {
		response.render('rules');
	},

	async startGame(request, response) {
		const numQuestions = await Questionnaire.countDocuments({});
		const randomNumber = Math.floor(Math.random() * numQuestions);
		const randomQuestion = await Questionnaire.find().limit(1).skip(randomNumber);
		response.render('gameView', { randomQuestion });
	}
};
