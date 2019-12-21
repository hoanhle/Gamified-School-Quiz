# BWA/TIETA12 coursework assignment

In the assignment, we gamify multi-choice questionnaire.
The assignment consists of three parts: the game, management view, and testing/documentation.

1. game - some mechanism for selecting the right answers

2. management implies CRUD operations: questions can be created, queried, modified, and deleted.

3. test your modifications, that is game and management view in particular, other tests can be implemented as well.

In the beginning of December, we will meet all the groups to check that each
group has some idea how to proceed.
In addition, we promote MIT licensing:
if you grant the license, your game may be integrated in the LukioPlussa project;
the project is funded by the Ministry of Education. Its aim is to provide free learning material
for high-school students, especially for the domains of mathematics and computer science.

### The project structure

```
.
├── app.js                          --> express app
├── index.js                        --> bwa app
├── package.json                    --> app info and dependencies
├── controllers                     --> controllers (handle e.g. routing)
│   ├── db.js                       --> 
│   ├── game.js                     -->   
│   ├── hello.js                    --> the same as "minimal viable grader"
│   ├── managementView.js           --> 
│   └── user.js                     --> 
├── models                          --> models that reflect the db schemes
│                                       and take care of storing data
├── public                          --> location for public (static) files
│   ├── img                         --> for images
│   ├── js                          --> for javascript
│   │   ├── db.js                   --> 
│   │   ├── game.js                 -->   
│   │   └── mathGenerator.js        --> 
│   └── css                         --> for styles
│─ routes                          --> a dir for router modules
│   ├── game.js                     --> 
│   ├── hello.js                    --> / (root) router
│   ├── managementView.js           -->   ...
│   ├── questionnaire.js            -->   ...
│   └── users.js                    --> /users router
│── views                           --> views - visible parts
│   ├── chooseQuestionnaire.hbs     --> 
│   ├── confirmation_message.hbs    --> 
│   ├── endGame.hbs                 --> 
│   ├── error.hbs                   --> error view
│   ├── game.hbs                    --> 
│   ├── gameView.hbs                --> 
│   ├── hello-graded.hbs            --> 
│   ├── hello.hbs                   --> main view - "minimal viable grader"
│   ├── layouts                     --> layouts - handlebar concept
│   │   └── default.hbs             --> layout view, "template" to be rendered
│   ├── managementView.hbs          --> 
│   ├── partials                    --> smaller handlebar components to be included in views
│   ├── rules.hbs                   --> 
│   └── user                        --> 
└── test                            --> tests
│   ├── assignment                  --> unit tests written by the group
│   │   ├── dbFunctionalities.testjs--> test database communications CRUD functions
│   │   └── management.test.js      -->  
│   ├── integration                 --> integration tests
│   │   ├── game.test.js            --> 
│   │   ├── hello.reply.test.js     -->  
│   │   ├── hello.test.js           -->
│   │   ├── security.test.js        -->  
│   │   └── users.test.js           --> 
│   ├── mocha.opts                  --> 
│   ├── models                      --> unit tests for models
│   │   ├── db.test.js              -->  
│   │   ├── hello.test.js           --> 
│   │   ├── questionnaire.test.js   -->  
│   │   └── user.test.js            --> 
│── └── setup.test.js               --> 
└── screenshots                     --> some screenshots of the app interface

```

## Game
First, you have to login. Please register an account if you don't have one yet.

From the homepage, click on "Who wants to be a millionaire" to access the game.

You can choose to start the game right away, or to read the rules first.

The game is similar to the famous television show "Who wants to be a millionnaire", with a few differences. The student will answer a randomly-generated multiple-choice questions one-by-one, from a questionnaire of his/her choice. Each question will be randomly picked from all questions of the questionnaire, with 4 options to choose from - they are in turn randomly picked from all of the question's options.

During one gameplay, the student have 2 "helps": 
  **50/50** - remove 50% of the answers, 
  **Skip** - skip the current question
Each of these helps can only be used once in each game.

The game *will not stop* until the player press "Grade". After pressing the button, the player's answers will be graded, The results will then be displayed. The "maximum points" in this case is the total number of points worth from all the questions generated and displayed.

## Management view

The management view enables the admin/teacher to perform the 4 CRUD operations: Create, Read, Update and Delete.

## Tests and documentation

Apart from the tests already provided by the course in folders test/integration and test/models, our team has written a few more tests in test/assignment to test game functionalities, management view and database communications.

## Security concerns

Below are some common security threats and how this project work is protected against them.

1. Cross-site scripting (XSS): A method used to injecting client-side scripts into web pages. If hackers can run JavaScript code on your webpage, a lot of damage can be done.

To prevent this threat, we use [Helmet](https://www.npmjs.com/package/helmet), which secures the app by setting various HTTP headers. Regarding XSS, Helmet contains an [XSS Filter](https://helmetjs.github.io/docs/xss-filter/) middleware, which adds some small XSS protections. Helmet contains up to 14 middlewares, which [protect against a wide variety of attacks](https://expressjs.com/en/advanced/best-practice-security.html#use-helmet).

2. CSRF (Cross-Site Request Forgery): A hacker can create an AJAX Button on a form that makes a request against the site from an external site. This can result in data theft.

To prevent this threat, we use CSRF Tokens mechanism:
  * First, the server sends a client a token.
  * Client then submit a form with the token. 
  * If the token is invalid, the server rejects the request.

We use [csurf](https://www.npmjs.com/package/csurf), which is a middleware for CSRF token creation and validation. The token is added into a hidden field in each form, this token is then validated against the visitor's session or csrf cookie.

3. NoSQL Injections: A hacker may try to inject code in an input that, in order to change existing data in the databse or to get restricted access. The common solution is to sanitize the input before using them.

However, for this project, because we use Mongoose with mongoDB, sanitizing the input is not required. Since we defined Mongoose Schema for all types of input (User, Questionnaire), the input will be converted to its corresponding type beforehand, and no damage will be done.

4. Regarding passwords: the password should not be stored as plain text since the database can be hacked.

We use [bcrypt](https://www.npmjs.com/package/bcryptjs) to hash password before storing, and to check the password for authentication. Bcrypt is designed to protect against rainbow table attacks (which is a common way to hack hashed passwords), and it can keep up with Moore's law, therefore it remains resistant to brute-force search attacks even with increasing computation power.

---

## Installation

1. Install `nodejs` and `npm`, if not already installed.

2. Execute in the root, in the same place, where _package.json_-file is):

    ```
    npm install
    ```

3. **Copy** `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file)

    ```
    cp -i .env.dist .env
    ```

    **Obs: If `.env`-file already exists, do not overwrite it!**

    **Note: Do not save `.env` file to the git repository - it contains sensitive data!**

    **Note: Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!**

    Modify `.env` file and set the needed environment variables.

    In the real production environment, passwords need to be
    long and complex. Actually, after setting them, one does
    not need to memorize them or type them manually.

4. `Vagrantfile` is provided. It defines how the vagrant
   environment is set up, commands to be run:

    `vagrant up` //sets up the environment
    `vagrant ssh` //moves a user inside vagrant

    Inside vagrant, go to the directory `/bwa` and start the app:
    `npm start`

5. As an other alternative, `Dockerfile` is provided as well.
   Then, docker and docker-compile must be installed.
   In the root, give:

    ```
    docker-compose build && docker-compose up
    ```

    or

    ```
    docker-compose up --build
    ```

    The build phase should be needed only once. Later on you should omit the build phase and simply run:

    ```
    docker-compose up
    ```

    The container is started in the terminal and you can read what is written to console.log. The container is stopped with `Ctrl + C`.


    Sometimes, if you need to rebuild the whole docker container from the very beginning,
    it can be done with the following command:

    ```
    docker-compose build --no-cache --force-rm && docker-compose up
    ```

6. Docker container starts _bwa_ server and listens `http://localhost:3000/`

7) Docker container is stopped in the root dir with a command:

    ```
    docker-compose down
    ```

## Coding conventions

Project uses _express_ web app framework (https://expressjs.com/).
The application starts from `index.js` that in turn calls other modules.  
The actual _express_ application is created and configured in `app.js` and
routes in `router.js`.

The application complies with the _MVC_ model, where each route has
a corresponding _controller_ in the dir of `controllers`.
Controllers, in turn, use the models for getting and storing data.
The models centralize the operations of e.g. validation, sanitation
and storing of data (i.e., _business logic_) to one location.
Having such a structure also enables more standard testing.

As a _view_ component, the app uses _express-handlebars_;
actual views are put in the dir named `views`. It has two subdirectories:
`layouts` and `partials`.
`layouts` are whole pages, whereas `partials` are reusable smaller
snippets put in the `layouts` or other views. Views, layouts, and partials
use _handlebars_ syntax, and their extension is `.hbs`.
More information about _handlebars_ syntax can be found in: http://handlebarsjs.com/

Files such as images, _CSS_ styles, and clientside JavaScripts are under the `public` directory. When the app is run in a browser, the files are located under the`/`path, at the root of the server, so the views must refer to them using the absolute path. (For example, `<link rel =" stylesheet "href =" / css / style.css ">`) ** Note that `public` is not part of this path. **

The _mocha_ and _chai_ modules are used for testing and the tests can be found under the `test` directory.

##About coding policies

The project code aims to follow a consistent coding conventions
ensured by using the _eslint_ code validation tool. The primary purpose of the tool is to ensure that the project code follows more or less the generally accepted style of appropriate conventions, and that the code avoids known vulnerabilities and / or risky coding practices. In addition, the tool aims to standardize the appearance of code of all programmers involved in the project so that all code is easy to read and maintainable for non-original coders as well.

English is recommended for naming functions and variables and commenting on code. Git commit messages should also be written in English, but this is neither required nor monitored.

##Code style

The _eslint_ tool used is configured to require certain stylistic considerations that can reasonably be considered as opinion issues and may not necessarily be true or false. The intention is not to initiate any debate on the subject or upset anyone's mind, but to strive for uniformity in the appearance of the code, with no other motives.

This project follows the following coding styles:

-   indents with 4 spaces
-   the code block starting bracket `{` is in the same line as the block starting the function, clause or loop
-   the block terminating bracket `}` in the code block is always on its own line, except in cases where the whole block is on a single line
-   the _camelCase_ style is recommended for naming functions and variables
-   the variables should not be defined by using the `var` keyword, but the variables and constants are defined using the`let` and `const` keywords
-   each line of code ends with a semicolon `;`

You can check the style of your code by command:

`` ` npm run lint `` `

_eslint_ can also correct some code errors and style violations automatically, but you shouldn't rely on this blindly. You can do this explicitly with the command:

`` ` npm run lint:fix `` `

Naturally, it is easier to set up a code editor to monitor and correct the style during coding.

The project root directory contains the VSCode Editor configuration folder, where the appropriate settings are available for the editor. In addition, it contains plugin recommendations that VSCode will offer to install if the user so wishes. In addition, the project includes the _.editorconfig_ file, which allows you to easily import some of your settings to a number of other editors.
