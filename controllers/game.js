'use strict';

module.exports = {
	showStartGame(request, response) {
		response.render('game');
	},

	showRules(request, response) {
		response.render('rules');
	}
};
