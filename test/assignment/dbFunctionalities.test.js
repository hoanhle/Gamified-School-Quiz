/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
'use strict';

// NPM install mongoose and chai. Make sure mocha is globally
// installed
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;
// const assert = require('assert');
const config = require('config');

const mathGenerator = require('../../controllers/mathGenerator');

describe('Database functionalities', function() {
    describe('db connection', function() {

        const db = require('../../models/db');
        const dbController = require('../../controllers/db');
        const Questionnaire = require('../../models/questionnaire');

        before(async function() {
            const dbConfig = config.get('mongo');
            console.log(dbConfig);
            // connect to database
            db.connectDB(dbConfig);
            await dbController.deleteAllQuestionnaires();
        });

        after(function() {
            db.disconnectDB();
        });

        it('must be able to add a questionnaire', async function() {
            const number = 1;
            const questionnaireTitle = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle, 100, 10, 1, 4);
            // count number of questionnaires in the database
            const prevNum = await Questionnaire.countDocuments({});
            expect(prevNum).to.exist;
            // add sample questionnaire to db
            await dbController.addQuestionnaire(data);
            // count number of questionnaires in the database afterwards
            const nextNum = await Questionnaire.countDocuments({});
            await dbController.deleteAllQuestionnaires();

            expect(nextNum).to.exist;

            // compare before & after
            expect(nextNum).to.equal(number);
            expect(nextNum).to.equal(prevNum + number);
            
        });

        it('must be able to read all questionnaires', async function() {
            const data1 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
            const data2 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
            const data3 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
            await dbController.addQuestionnaire(data1);
            await dbController.addQuestionnaire(data2);
            await dbController.addQuestionnaire(data3);

            const numAll = await Questionnaire.countDocuments({});
            const allQuestionnaires = await dbController.getAllQuestionnaires();
            const numAllReceived = allQuestionnaires.length;

            await dbController.deleteAllQuestionnaires();

            expect(numAll).to.exist;
            expect(numAllReceived).to.exist;
            expect(numAllReceived).to.equal(numAll);
            expect(numAllReceived).to.equal(3);
        });

        it('must be able to read one questionnaire', async function() {
            const questionnaireTitle = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle, 100, 10, 1, 4);
            await dbController.addQuestionnaire(data);

            const questionnaires = await dbController.getAllQuestionnaires();
            const questionnaireRetrievedFromAll = questionnaires[0];
            const questionnaireId = questionnaireRetrievedFromAll._id;
            const questionnaire = await dbController.getQuestionnaire(questionnaireId);
            await dbController.deleteAllQuestionnaires();

            expect(questionnaire).to.exist;
            expect(questionnaireRetrievedFromAll).to.exist;
            expect(questionnaire.title).to.equal(questionnaireRetrievedFromAll.title);
        });

        it('must be able to update an existing questionnaire', async function() {
            const oldOptionsNum = 4;
            const questionnaireTitle1 = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle1, 100, 10, 1, oldOptionsNum);
            await dbController.addQuestionnaire(data);

            const newOptionsNum = 3;
            const questionnaireTitle2 = randomStr();
            const newData = mathGenerator.generateQuestionnaire(questionnaireTitle2, 100, 10, 1, newOptionsNum);
            const questionnaires = await dbController.getAllQuestionnaires();
            const questionnaireRetrievedFromAll = questionnaires[0];
            const questionnaireId = questionnaireRetrievedFromAll._id;
            await dbController.updateQuestionnaire(questionnaireId, newData);

            const receivedQuestionnaire = await dbController.getQuestionnaire(questionnaireId);
            
            await dbController.deleteAllQuestionnaires();

            expect(receivedQuestionnaire).to.exist;
            expect(receivedQuestionnaire.questions[0].options.length).to.equal(newOptionsNum);
        });

        it('must be able to delete one questionnaire', async function() {
            const questionnaireTitle = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle, 100, 10, 1, 4);
            await dbController.addQuestionnaire(data);
            const prevNum = await Questionnaire.countDocuments({});

            const questionnaires = await dbController.getAllQuestionnaires();
            const questionnaireRetrievedFromAll = questionnaires[0];
            const questionnaireId = questionnaireRetrievedFromAll._id;

            await dbController.deleteQuestionnaire(questionnaireId);
            const newNum = await Questionnaire.countDocuments({});

            await dbController.deleteAllQuestionnaires();

            expect(prevNum).to.exist;
            expect(newNum).to.exist;
            expect(newNum).to.equal(prevNum - 1);
        });

        it('must be able to delete one question from an existing questionnaire', async function() {
            const questionnaireTitle = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle, 100, 10, 1, 4);
            await dbController.addQuestionnaire(data);

            const questionnaires = await dbController.getAllQuestionnaires();
            const questionnaireRetrievedFromAll = questionnaires[0];
            const oldQuestionsNum = questionnaireRetrievedFromAll.questions.length;

            const questionnaireId = questionnaireRetrievedFromAll._id;
            const questionId = questionnaireRetrievedFromAll.questions[0]._id;

            await dbController.deleteQuestion(questionnaireId, questionId);

            const questionnaire = await dbController.getQuestionnaire(questionnaireId);
            const newQuestionsNum = questionnaire.questions.length;

            await dbController.deleteAllQuestionnaires();

            expect(questionnaireRetrievedFromAll).to.exist;
            expect(oldQuestionsNum).to.exist;
            expect(questionnaire).to.exist;
            expect(newQuestionsNum).to.exist;
            expect(newQuestionsNum).to.equal(oldQuestionsNum - 1);

        });

        it('must be able to update one question from an existing questionnaire', async function() {
            const questionnaireTitle = randomStr();
            const data = mathGenerator.generateQuestionnaire(questionnaireTitle, 100, 10, 1, 4);
            await dbController.addQuestionnaire(data);

            const questionnaires = await dbController.getAllQuestionnaires();
            const questionnaireRetrievedFromAll = questionnaires[0];
            const questionnaireId = questionnaireRetrievedFromAll._id;
            const question = questionnaireRetrievedFromAll.questions[0];
            const questionId = question._id;

            const newTitle = 'New question title';
            const newMaxPoints = 10;
            await dbController.updateQuestion(questionnaireId, questionId, newTitle, question.options, newMaxPoints);

            const questionnaire = await dbController.getQuestionnaire(questionnaireId);
            const newQuestion = questionnaire.questions[0];

            const retrievedTitle = newQuestion.title;
            const retrievedMaxPoints = newQuestion.maxPoints;

            await dbController.deleteAllQuestionnaires();

            expect(questionnaireRetrievedFromAll).to.exist;
            expect(questionnaire).to.exist;
            expect(newQuestion).to.exist;
            expect(retrievedTitle).to.exist;
            expect(retrievedMaxPoints).to.exist;
            expect(retrievedTitle).to.equal(newTitle);
            expect(retrievedMaxPoints).to.equal(newMaxPoints);
        });

    });
});

function randomStr() { 
    return Math.random().toString(36).slice(2); 
}
