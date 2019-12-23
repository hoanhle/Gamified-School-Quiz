/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
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
const db = require('../../models/db');
const dbController = require('../../controllers/db');

const Questionnaire = require('../../models/questionnaire');
const User = require('../../models/user');

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

describe('Management Questionnaire CRUD', function() {
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
        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();
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

    it('R: read operation available', async function(){
        // Check that the title exists
        browser.assert.elements('.link', 1, 'q_title');
        browser.assert.evaluate('document.getElementsByClassName("link")[0].text === "Questionnaire title"');
    });
    it('U: update operation available', async function(){ 
        // Check that pressing the button takes you to another page and the title is there
        browser.assert.elements('.visitQuestionaire', 1);
        await browser.pressButton('.visitQuestionaire');
        browser.assert.success();
        // For some reason exact match is not found so we use partial.
        browser.assert.evaluate('document.getElementsByTagName("h2")[0].textContent.search("Questionnaire") !== -1');
        
    });

    it('D: delete operation available', async function() {
        // Check that deleting a question removes the question.
        browser.assert.elements('.lni-trash', 1);
        await browser.pressButton('.deleteQuestionaire');
        browser.assert.success();
        
        await browser.pressButton('.removeBtn');
        browser.assert.success();
     
        const questionaires = await Questionnaire.find({});
        expect(questionaires).to.exist;

        browser.assert.elements('.lni-trash', 0);
    });
});

describe('Management Question CRUD', function() {
    let server;
    let browser;

    before(async function() {
        // Delete all current questionaires
        const dbConfig = config.get('mongo');
        db.connectDB(dbConfig);
        await dbController.deleteAllQuestionnaires();
        
        // Add a questionaire
        const questionnaire = {
            title: 'Count without a calculator',
            submissions: 1,
            questions: [
                {
                    title: 'Select the calculations that result in 40',
                    maxPoints: 10,
                    options: [
                        {
                            option: '25 + 15',
                            correctness: true
                        },
                        {
                            option: '10 + 25',
                            correctness: false
                        }
                    ]
                },
                {
                    title: 'Select the calculations that result in 50',
                    maxPoints: 10,
                    options: [
                        {
                            option: '25 + 25',
                            correctness: true
                        },
                        {
                            option: '10 + 25',
                            correctness: false
                        }
                    ]
                }
            ]
        };
        await Questionnaire.create(questionnaire);
    

        // remove all users from the database and re-create admin user
        await User.deleteMany({});

        const userData = { ...admin, role: 'admin' };
        const user = new User(userData);
        await user.save();
        
    });

    beforeEach(async function() {
        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();
        await auth(browser);
        await browser.visit(mngmentUrl);
        await browser.pressButton('.visitQuestionaire');
        browser.assert.success();
        
    });

    afterEach(function() {
        server.close();
    });

    
    it('C: create operation available', async function() {
        // Got to a questionaire and fill the form and submit it.
        browser.fill('Question', 'Question title');
        browser.fill('points', 10);
        browser.fill('options[1][option]', 'Option 1');
        browser.check('options[1][correctness]');
        browser.fill('options[2][option]', 'Option 2');
        browser.fill('options[3][option]', 'Option 3');
        browser.fill('options[4][option]', 'Option 4');
        await browser.pressButton('.btnAddQuestion');
        browser.assert.success();
        const questionaires = await Questionnaire.find({});
        expect(questionaires[0].questions[2]).to.exist;
    
    });
    it('R: Read operation available', async function() {
        // Check that the title of the question is rendered on the page. 
        browser.assert.evaluate('document.getElementsByTagName("h3")[2].textContent.search("Question title") !== -1');
    });
    it('U: Update operation available', async function() {
        browser.assert.elements('.questionEdit', 3);
    });
    it('D: delete operation available', async function() {
        await browser.pressButton('.questionDelete');
        browser.assert.success();
        const questionaires = await Questionnaire.find({});
        expect(questionaires[0].questions[2]).to.be.undefined;
    });
});
