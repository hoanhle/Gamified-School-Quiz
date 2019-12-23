/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const Game = require('../../models/game');
const mathGenerator = require('../../public/js/mathGenerator');

async function generateSomeQuestionaires(dbController) {
    const data1 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    const data2 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    const data3 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    await dbController.addQuestionnaire(data1);
    await dbController.addQuestionnaire(data2);
    await dbController.addQuestionnaire(data3);
}

async function getAnId(dbController) {
    const questionnaires = await dbController.getAllQuestionnaires();
    const questionnaireRetrievedFromAll = questionnaires[0];
    return questionnaireRetrievedFromAll._id;
}

function randomStr() {
    return Math.random().toString(36).slice(2);
}

describe('Game', function() {
    const dbController = require('../../controllers/db');

    before(async function() {
        await dbController.deleteAllQuestionnaires();
        await generateSomeQuestionaires(dbController);
    });

    describe('generateRandomQuestion()', function() {
        it('must be able to generate a random question', async function() {
            const id = await getAnId(dbController);
            const question = Game.generateRandomQuestion(id);
            expect(question).to.exist;
        });

        it('must be able to find 4 random question from the question object', async function() {
            const id = await getAnId(dbController);
            const question = await Game.generateRandomQuestion(id);
            const options = await Game.generateOptions(question);

            const numOptions = (await options).length;

            expect(numOptions).to.exist;
            expect(numOptions).to.equal(4);
        });

        it('must be able to reduce 4 possible answer options to 2 possible answer options', async function() {
            const id = await getAnId(dbController);
            const question = await Game.generateRandomQuestion(id);
            const options = await Game.generateOptions(question);
            const reducedOptions = await Game.reduceHalfOption(options);
            const numOptions = options.length;
            const numReducedOptions = reducedOptions.length;

            expect(numOptions).to.exist;
            expect(numOptions).to.equal(4);
            expect(numReducedOptions).to.exist;
            expect(numReducedOptions).to.equal(2);
        });
    });
});
