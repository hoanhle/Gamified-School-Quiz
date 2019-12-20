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
		const randomQuestion = await Game.generateRandomQuestion(chooseQuestionaire);
		const title = randomQuestion.title;
		const options = await Game.generateOptions(randomQuestion);

		// Set cookies for using later
		request.session.maxPoint = randomQuestion.maxPoints;
		request.session.questionaire = chooseQuestionaire;
		request.session.points = 0;
		request.session.maxPoints = 0;
		request.session.helpOption1 = true;
		request.session.helpOption2 = true;
		request.session.options = options;

		// Render view
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
		// if correct, points and maxPoints all increase by question.maxPoints
		// if not, maxPoints increases by question.maxPoints
		if (isCorrect === 'true') {
			request.session.points += request.session.maxPoint;
			request.session.maxPoints += request.session.maxPoint;
		} else {
			request.session.maxPoints += request.session.maxPoint;
		}

		// Generate new question from the questionaire
		const randomQuestion = await Game.generateRandomQuestion(request.session.questionaire);
		const title = randomQuestion.title;
		const options = await Game.generateOptions(randomQuestion);

		// Update cookies
		request.session.maxPoint = randomQuestion.maxPoints;
		request.session.options = options;

		// Render view
		response.render('gameView', {
			title: title,
			options: options,
			points: request.session.points,
			helpOption1: request.session.helpOption1,
			helpOption2: request.session.helpOption2
		});
	},

	/**
     * Process when help buttons clicked
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async helpClicked(request, response) {
		const helpOption = request.body.helpOption;
		if (helpOption == 'skip') {
			const randomQuestion = await Game.generateRandomQuestion(request.session.questionaire);
			const title = randomQuestion.title;
			const options = await Game.generateOptions(randomQuestion);
			request.session.helpOption2 = false;
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
     * Send submission to A* system
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
	async gradeGame(request, response) {
		response.render('hello-graded', {
			points: request.session.points,
			maxPoints: request.session.maxPoints,
			status: 'graded',
			description: 'minimal viable grader in the express framework',
			title: 'A+ greetings'
		});
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
		} else if (request.body.helpOption) {
			module.exports.helpClicked(request, response);
		} else {
			module.exports.gradeGame(request, response);
		}
	}
};
