'use strict';

const Questionnaire = require('../models/questionnaire');
const db = require('../controllers/db');
const Game = require('../models/game');

module.exports = {
	/**
     * Returns start menu game
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async showStartGame(request, response) {
		response.render('game');
	},

	/**
     * Returns how to play menu
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async showRules(request, response) {
		response.render('rules');
	},

	/**
     * Start the game menu
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async startGame(request, response) {
		const randomQuestion = await Game.generateRandomQuestion();
		const title = randomQuestion.title;
		const options = await Game.generateOptions(randomQuestion);
		request.session.points = 0;
		response.render('gameView', {
			title: title,
			options: options,
			points: request.session.points
		});
	},

	async gradeAnswer(request, response) {
		const isCorrect = request.body.option;
		// if correct, render the next random questions
		if (isCorrect === 'true') {
			const randomQuestion = await Game.generateRandomQuestion();
			const title = randomQuestion.title;
			const options = await Game.generateOptions(randomQuestion);
			request.session.points += 1;
			response.render('gameView', {
				title: title,
				options: options,
				points: request.session.points
			});
		} else {
			const points = request.session.points;
			response.render('endGame', { points });
		}
	}
};
