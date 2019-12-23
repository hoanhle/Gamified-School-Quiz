/* eslint-disable no-console */
'use strict';

// Zombie.js documentation can be found at: https://www.npmjs.com/package/zombie

require('dotenv').config();
const assert = require('assert');
const config = require('config');
const http = require('http');
const Browser = require('zombie');

const app = require('../../app.js');
const admin = config.get('admin');
const port = 3333;
const mathGenerator = require('../../public/js/mathGenerator');
const User = require('../../models/user');
const db = require('../../models/db');
const dbController = require('../../controllers/db');


async function auth(browser) {
    // Load login page
    await browser.visit('/users/login');

    // Fill in login information and login
    browser.fill('email', admin.email);
    browser.fill('password', admin.password);
    await browser.pressButton('#btnLogin');
}

async function generateSomeQuestionaires() {
    const data1 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    const data2 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    const data3 = mathGenerator.generateQuestionnaire(randomStr(), 100, 10, 1, 4);
    await dbController.addQuestionnaire(data1);
    await dbController.addQuestionnaire(data2);
    await dbController.addQuestionnaire(data3);
}

async function getAnId() {
    const questionnaires = await dbController.getAllQuestionnaires();
    const questionnaireRetrievedFromAll = questionnaires[0];
    return questionnaireRetrievedFromAll._id;
}

function randomStr() {
    return Math.random().toString(36).slice(2);
}

describe('Millionnaire game reply: A+ protocol', function() {
    let server;
    let browser;

    before(async function() {
    // Delete all current questionaires
        const dbConfig = config.get('mongo');
        db.connectDB(dbConfig);
        await dbController.deleteAllQuestionnaires();

        // remove all users from the database and re-create admin user
        await User.deleteMany({});

        const userData = { ...admin, role: 'admin' };
        const user = new User(userData);
        await user.save();
    });

    beforeEach(async function() {
    // Connect to sever and browser
        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();
        // console.log('A+ protocol defined in https://github.com/Aalto-LeTech/a-plus/blob/master/doc/GRADERS.md');
        await auth(browser);

        // Generate some questionaires to database
        await generateSomeQuestionaires();
        const id = await getAnId();
        await browser.visit(`/games/${id}`);
        await browser.pressButton('#grade');
    });

    afterEach(function() {
        server.close();
    });

    it('must have meta field "status" in head', function() {
        assert.equal(browser.document.head.querySelectorAll('[name=status]').length, 1);
    });

    it('should have meta field "max_points" in head', function() {
        assert.equal(browser.document.head.querySelectorAll('[name=max_points]').length, 1);
    });

    it('must have meta field "points" in head', function() {
        assert.equal(browser.document.head.querySelectorAll('[name=points]').length, 1);
    });

    it('meta field "points" in head must be less than or equal to max_points', function() {
        const pointsElem = browser.document.head.querySelector('[name=points]');
        const points = parseInt(pointsElem.getAttribute('content'));
        const maxPointsElem = browser.document.head.querySelector('[name=max_points]');
        const maxPoints = parseInt(maxPointsElem.getAttribute('content'));

        assert(points <= maxPoints, 'head meta points must be less or equal to max_points');
    });

    it('should have meta field "DC.Description" in head', function() {
        // Where does this field come from? Or more specifically
        // where does the value/description come from?
        // (Not strictly related to testing but still...)
        assert.equal(browser.document.head.querySelectorAll('[name="DC.Description"]').length, 1);
    });

    it('should have meta field "DC.Title" in head', function() {
        // Where does this field come from? Or more specifically
        // where does the value/title come from? (Is this the question title?)
        // (Not strictly related to testing but still...)
        assert.equal(browser.document.head.querySelectorAll('[name="DC.Title"]').length, 1);
    });
});
