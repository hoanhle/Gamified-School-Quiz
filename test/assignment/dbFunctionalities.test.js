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

describe('Database funcitonalities', function() {
    describe('db connection', function() {

        const db = require('../../models/db');
        const dbController = require('../../controllers/db');
        const Questionnaire = require('../../models/questionnaire');
        const questionnaireTitle = 'Some title';
        const title1 = 'Title 1';
        const title2 = 'Title 2';
        const title3 = 'Title 3';

        before(async function() {
            const dbConfig = config.get('mongo');
            // connect to database
            db.connectDB(dbConfig);
            await dbController.deleteAllQuestionnaires();
        });

        after(function() {
            db.disconnectDB();
        });

        it('must be able to add a questionnaire', async function() {
            const number = 1;
            const data = generateData(questionnaireTitle, 4);
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
            const optionsNum = 4;
            const data1 = generateData(title1, optionsNum);
            const data2 = generateData(title2, optionsNum);
            const data3 = generateData(title3, optionsNum);
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
            const data = generateData(questionnaireTitle, 4);
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
            const data = generateData(questionnaireTitle, oldOptionsNum);
            await dbController.addQuestionnaire(data);

            const newOptionsNum = 3;
            const newData = generateData(questionnaireTitle, newOptionsNum);
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
            const optionsNum = 4;
            const data = generateData(questionnaireTitle, optionsNum);
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
            const optionsNum = 4;
            const data = generateData(questionnaireTitle, optionsNum);
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
            const optionsNum = 4;
            const data = generateData(questionnaireTitle, optionsNum);
            await dbController.addQuestionnaire(data);

            let questionnaires = await dbController.getAllQuestionnaires();
            let questionnaireRetrievedFromAll = questionnaires[0];
            const questionnaireId = questionnaireRetrievedFromAll._id;
            const question = questionnaireRetrievedFromAll.questions[0];
            const questionId = question._id;

            const newTitle = "New question title";
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

/* TODO: use this instead of the .json file, needs some more debugging, options not unique? */
function generateData(questionnaireTitle, NUMBER_OF_OPTIONS) {
    // eslint-disable-next-line sonarjs/prefer-object-literal
    const data = {};
    data.title = questionnaireTitle;
    data.submissions = '100';
    data.questions = [];

    const endResult = getRandomInt(60);    //TODO: more 'AI' version, if the endResult is generated based on the person's previous results
    data.questions.push(getQuestion(endResult, NUMBER_OF_OPTIONS));

    let anotherResult = getRandomInt(100);
    while (anotherResult === endResult){
        anotherResult = getRandomInt(100);
    }
    data.questions.push(getQuestion(anotherResult, NUMBER_OF_OPTIONS));

    return data;
}

function getQuestion(endResult, NUMBER_OF_OPTIONS) {
    return  {
        title: `Choose calculations whose end result is ${endResult}`,
        maxPoints: 10,
        options: getOptions(endResult, NUMBER_OF_OPTIONS)
    };
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const ADDITION = 0;
const SUBSTRACTION = 1;
const MULTIPLICATION = 2;
const DIVISION = 3;

function getOptions(rndEndResult, number) {
    const options = [];
    const titles = [];
    let noTrue = true;
    while (options.length < number || noTrue) {
        const rndCalcType = getRandomInt(4);
        // questions.push(JSON.stringify(getOption(rndEndResult, rndCalcType)));
        const option = getOption(rndEndResult, rndCalcType);
        if (titles.includes(option[0]) || option[0]==null) continue;
        if (option[1]) noTrue = false;
        if (options.length === (number - 1) && noTrue) continue; 
        titles.push(option[0]);
        options.push({option:option[0], correctness:option[1]});
    }
    return options;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function getOption(endResult, rndCalcType) {
    //  'options': [{'option': '25 + 15','correctness': true}]
    //
    // addition
    // substraction
    // division
    // multiplication
    let first = getRandomInt(endResult);
    const sign = getRandomInt(2);
    let rndError;
    let second;
    if (rndCalcType === ADDITION) {
        second = endResult - first;
        // add error
        rndError = getRandomInt(4);
        second = Math.abs(sign < 1 ? second : (sign < 2 ? second - rndError : second + rndError));
        return [`${first} + ${second}`, (second + first === endResult)];
    }
    if (rndCalcType === SUBSTRACTION) {
        second = endResult + first;
        rndError = getRandomInt(5);
        second = sign < 1 ? second : (sign < 2 ? second - rndError : second + rndError);
        return [`${second} - ${first}`, second - first === endResult];
    }
    if (rndCalcType === MULTIPLICATION) {
        first = getRandomInt(Math.floor(endResult / 2));
        if (first === 0) first = 1;
        second = Math.floor(endResult / first);
        rndError = getRandomInt(2);
        second = sign < 1 ? second - rndError : second + rndError;
        return `${first} * ${second}`, (first * second === endResult);
    }
    if (rndCalcType === DIVISION) {
        second = getRandomInt(7);
        if (second === 0) second = 1;
        first = endResult * second;
        rndError = getRandomInt(2);
        first = sign < 1 ? first - rndError : first + rndError;
        return [`${first} / ${second}`, (first / second === endResult)];
    }
    return [null, null];
}
