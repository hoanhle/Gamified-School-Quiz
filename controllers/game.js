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
     * Returns interface for players to choose questionaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async showQuestionaires(request, response) {
		const questionaires = await db.getAllQuestionnaires();
		response.render('chooseQuestionaire', { questionaires });
	},

	/**
     * Start the game menu
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async startGame(request, response) {
		const chooseQuestionaire = request.body.questionaire;
		request.session.questionaire = chooseQuestionaire;
		const randomQuestion = await Game.generateRandomQuestion(chooseQuestionaire);
		const title = randomQuestion.title;
		const options = await Game.generateOptions(randomQuestion);
		request.session.points = 0;
		request.session.helpOption1 = true;
		request.session.helpOption2 = true;
		request.session.options = options;
		request.session.title = title;
		response.render('gameView', {
			title: title,
			options: options,
			points: request.session.points,
			helpOption1: request.session.helpOption1,
			helpOption2: request.session.helpOption2
		});
	},

	/**
     * Grade answer and generate new question if player passed
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async gradeAnswer(request, response) {
		const isCorrect = request.body.option;
		// if correct, render the next random questions
		if (isCorrect === 'true') {
			const randomQuestion = await Game.generateRandomQuestion(request.session.questionaire);
			const title = randomQuestion.title;
			const options = await Game.generateOptions(randomQuestion);
			request.session.points += 1;
			request.session.options = options;
			request.session.title = title;
			response.render('gameView', {
				title: title,
				options: options,
				points: request.session.points,
				helpOption1: request.session.helpOption1,
				helpOption2: request.session.helpOption2
			});
		} else {
			const points = request.session.points;
			response.render('endGame', { points });
		}
	},

	async helpClicked(request, response) {
		const helpOption = request.body.helpOption;
		console.log(helpOption);
		if (helpOption == 'skip') {
			const randomQuestion = await Game.generateRandomQuestion(request.session.questionaire);
			const title = randomQuestion.title;
			const options = await Game.generateOptions(randomQuestion);
			request.session.helpOption2 = false;
			request.session.title = title;
			request.session.options = options;
			response.render('gameView', {
				title: title,
				options: options,
				points: request.session.points,
				helpOption1: request.session.helpOption1,
				helpOption2: request.session.helpOption2
			});
		} else if (helpOption == 'half') {
			const options = await Game.reduceHalfOption(request.session.options);
			request.session.helpOption1 = false;
			response.render('gameView', {
				title: request.session.title,
				options: options,
				points: request.session.points,
				helpOption1: request.session.helpOption1,
				helpOption2: request.session.helpOption2
			});
		}
	},

	/**
     * Choose how to handle POST request to games/id
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async handleSubmit(request, response) {
		if (request.body.option) {
			module.exports.gradeAnswer(request, response);
		} else if (request.body.questionaire) {
			module.exports.startGame(request, response);
		} else {
			module.exports.helpClicked(request, response);
		}
	}
};
