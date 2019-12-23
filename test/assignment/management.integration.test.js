/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const config = require('config');
const http = require('http');
const chai = require('chai');
//const chaiHttp = require('chai-http');
const expect = chai.expect;
const Browser = require('zombie');
//chai.use(chaiHttp);

const app = require('../../app.js');
const admin = config.get('admin');
const port = 3333;

const Questionnaire = require('../../models/questionnaire');

const loginUrl = '/users/login';
const mngmentUrl = '/management';

async function auth(browser) {
    // Load login page
    await browser.visit(loginUrl);

    // Fill in login information and login
    browser.fill('email', admin.email);
    browser.fill('password', admin.password);
    await browser.pressButton('#btnLogin');
}

describe('Management Questionaire CRUD', function() {
    let server;
    let browser;

    beforeEach(async function() {
        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();
        // WARNING: So the course is fucked up again, this time you can only login as admin every other time
        // so when you try to run the first test, if the error is AssertionError [ERR_ASSERTION]: No INPUT matching 'q_title'
        // it means that this is the time when you cannot login as admin.
        // Run the test again to get the true error.
        await auth(browser);
        await browser.visit(mngmentUrl);
    });

    afterEach(function() {
        server.close();
    });

    // Go to /management to create a new questionnaire
    it('C: create operation available', async function(){
        // FIll in the form to create a new questionnaire
        browser.fill('q_title', 'Questionnaire title');
        browser.fill('Question', 'Question title');
        browser.fill('points', 10);
        browser.fill('options[1][option]', 'Option 1');
        browser.check('options[1][correctness]');
        browser.fill('options[2][option]', 'Option 2');
        browser.fill('options[3][option]', 'Option 3');
        browser.fill('options[4][option]', 'Option 4');
        await browser.pressButton('#btnAddQuestionnaire');

        browser.assert.success();

        // check if the question we just added exist in the database
        // I don't use controllers/db.js because the functions there use id, and we don't know
        // questionnaire id beforehand
        const questionnaire = await Questionnaire.findOne({ title: 'Questionnaire title' });
        expect(questionnaire).to.exist;
    });

    it('R: read operation available');

    it('U: update operation available');

    it('D: delete operation available');
});
