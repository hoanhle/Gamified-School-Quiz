/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const config = require('config');
const http = require('http');
const Browser = require('zombie');
const app = require('../../app.js');
const admin = config.get('admin');
const port = 3333;
const mathGenerator = require('../../public/js/mathGenerator');
const db = require('../../models/db');
const dbController = require('../../controllers/db');
const User = require('../../models/user');


// Zombie.js documentation can be found at: https://www.npmjs.com/package/zombie

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

describe('Game: A+ protocol', function() {
	let server;
	let browser;

	beforeEach(async function() {
		// Delete all current questionaires
		const dbConfig = config.get('mongo');
		db.connectDB(dbConfig);
		await dbController.deleteAllQuestionnaires();

        try {
            // remove all users from the database and re-create admin user
            await User.deleteMany({});

            const userData = { ...admin, role: 'admin' };
            const user = new User(userData);
            await user.save();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            throw err;
        }

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
	});

	afterEach(async function() {
		server.close();
	});

	it('must have a form with POST method', function() {
		//http://zombie.js.org/#assertions
		browser.assert.elements('form[method="POST"]', { atLeast: 1 });
		// browser.assert.attribute('form', 'method', 'post');
	});

	it('must have a form with submit button', function() {
		browser.assert.elements('form button[type="submit"]', { atLeast: 1 });
	});

	// TODO: this test currently fails due to unknown reason
	it('the submit button must have id "grade"', function() {
		browser.assert.element('#grade');
		browser.assert.element('button#grade');
	});
});
