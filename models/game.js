'use strict';

const db = require('../controllers/db');

module.exports = {
    /**
     * Generate a random question from the questionaire
     */
    async generateRandomQuestion(questionaireId) {
        const questionaire = await db.getQuestionnaire(questionaireId);
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
     * Reduce half of the current questionOptions
     * @param {Object} questionOptions current available questionOptions
     */
    async reduceHalfOption(questionOptions) {
        const options = [ ...questionOptions ];
        const chooseOptions = [];

        let falseOptionNum = 0;
        let trueOptionNum = 0;
        let k = 0;
        while (falseOptionNum < 1 || trueOptionNum < 1) {
            if (options[k].correctness && trueOptionNum < 1) {
                chooseOptions.push(options[k]);
                trueOptionNum = 1;
            } else if (!options[k].correctness && falseOptionNum < 1) {
                chooseOptions.push(options[k]);
                falseOptionNum = 1;
            }
            k += 1;
        }
        return chooseOptions;
    }
};
