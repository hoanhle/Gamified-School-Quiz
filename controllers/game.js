'use strict';

module.exports = {
	async showStartGame(request, response) {
		response.render('game');
	},

	async showRules(request, response) {
		response.render('rules');
	},

	async startGame(request, response) {
		response.render('gameView', {
			title: 'this is a questions',
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
	}
};
