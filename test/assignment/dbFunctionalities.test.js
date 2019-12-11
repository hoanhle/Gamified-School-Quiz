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
const fs = require('fs');
const path = require('path');
const config = require('config');

describe('Database funcitonalities', function() {
    describe('db connection', function() {

        const db = require('../../models/db');
        const dbController = require('../../controllers/db')
        const Questionnaire = require('../../models/questionnaire');

        before(function() {
            const dbConfig = config.get('mongo');
            // connect to database
            db.connectDB(dbConfig);
        })

        after(function() {
            db.disconnectDB();
        })

        it('must be able to add a questionnaire', async function () {
            const number = 1;
            const questionnaireTitle = "Some title";
            const data = generateData(questionnaireTitle, 4);
            // count number of questionnaires in the database
            const prevNum = await Questionnaire.countDocuments({});
            expect(prevNum).to.exist;
            // add sample questionnaire to db
            await dbController.addQuestionnaire(data);
            // count number of questionnaires in the database afterwards
            const nextNum = await Questionnaire.countDocuments({});
            expect(nextNum).to.exist;

            // compare before & after
            expect(nextNum).to.equal(number)
            expect(nextNum).to.equal(prevNum + number)
            await Questionnaire.deleteOne({title: questionnaireTitle})
        });

        it('must be able to read all questionnaires', async function() {
            const numAll = await Questionnaire.countDocuments({});
            const allQuestionnaires = await dbController.getAllQuestionnaires();
            const numAllReceived = allQuestionnaires.length;
            expect(numAll).to.exist;
            expect(numAllReceived).to.exist;
            expect(numAll).to.equal(numAllReceived)
        })

        it('must be able to read one questionnaire', async function() {
            const questionnaireTitle = "Some title";
            const data = generateData(questionnaireTitle, 4);
            await dbController.addQuestionnaire(data);
            const questionnaire = await dbController.getQuestionnaire(questionnaireTitle);
            expect(questionnaire).to.exist;
            expect(data.title).to.equal(questionnaire.title)
            await Questionnaire.deleteOne({title: questionnaireTitle})
        })

        it('must be able to update existing questionnaire with the same title', async function() {
            const questionnaireTitle = "Some title";
            const oldOptionsNum = 4;
            const data = generateData(questionnaireTitle, oldOptionsNum);
            await dbController.addQuestionnaire(data);

            const newOptionsNum = 3;
            const newData = generateData(questionnaireTitle, newOptionsNum);
            await dbController.updateQuestionnaire(questionnaireTitle, newData)

            const receivedQuestionnaire = await dbController.getQuestionnaire(questionnaireTitle);
            expect(receivedQuestionnaire).to.exist;
            expect(receivedQuestionnaire.title).to.equal(questionnaireTitle)
            expect(receivedQuestionnaire.questions[0].options.length).to.equal(newOptionsNum)
            await Questionnaire.deleteOne({title: questionnaireTitle})
        })

    });
});

/* TODO: use this instead of the .json file, needs some more debugging, options not unique? */
function generateData(questionnaireTitle, NUMBER_OF_OPTIONS) {
    // eslint-disable-next-line sonarjs/prefer-object-literal
    const data = {};
    data.title = questionnaireTitle;
    data.submissions = '100';
    data.questions = [];

    const endResult = getRandomInt(60);    //TODO: more "AI" version, if the endResult is generated based on the person's previous results
    data.questions.push(getQuestion(endResult, NUMBER_OF_OPTIONS));

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
    for (let i = 0; options.length < number; i++) {
        const rndCalcType = getRandomInt(4);
        // questions.push(JSON.stringify(getOption(rndEndResult, rndCalcType)));
        const option = getOption(rndEndResult, rndCalcType);
        if (titles.includes(option[0]) || option[0]==null) continue;
        options.push({option:option[0], correctness:option[1]});
    }
    return options;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function getOption(endResult, rndCalcType) {
    //  "options": [{"option": "25 + 15","correctness": true}]
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
        return [`${first} / ${second}`, (first / second === endResult)]
    }
    return [null, null];
}
