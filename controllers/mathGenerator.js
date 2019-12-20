/**
 * Generate a count without calculator questionnaire
 * @params {String} - questionnaireTitle: title of the questionnaire
 *         {Int} - number of times you can submit the questionnaire
 *         {Int} - questionsNum: number of questionsin the questionnaire
 *         {Int} - questionMaxPoints: maximum points that can be gained from each question
 *         {Int} - optionsNum: number of options in each question 
 */
function generateQuestionnaire(
    questionnaireTitle, 
    submissions,
    questionsNum, 
    questionMaxPoints,
    optionsNum) {
    // eslint-disable-next-line sonarjs/prefer-object-literal
    const data = {};
    data.title = questionnaireTitle;
    data.submissions = submissions;
    data.questions = [];
    results = [];

    while (data.questions.length < questionsNum) {
        const endResult = getRandomInt(100);
        if (results.includes(endResult)) continue;
        results.push(endResult);
        data.questions.push(getQuestion(endResult, questionMaxPoints, optionsNum));
    }

    return data;
}

/**
 * Generate a random question for the questionnaire
 * @params {Int} - endResult: the result of the calculation
 *         {Int} - questionMaxPoints: maximum points that can be gained from each question
 *         {Int} - optionsNum: number of options in each question 
 */
function getQuestion(endResult, questionMaxPoints, optionsNum) {
    return  {
        title: `Choose calculations whose end result is ${endResult}`,
        maxPoints: questionMaxPoints,
        options: getOptions(endResult, optionsNum)
    };
}

/**
 * Generate a random number, which will be the end result of the calculation
 * @params {Int} - maximum limit of the number generated
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const ADDITION = 0;
const SUBSTRACTION = 1;
const MULTIPLICATION = 2;
const DIVISION = 3;

/**
 * Generate a random question for the questionnaire
 * @params {Int} - rndEndResult: the result of the calculation
 *         {Int} - number: maximum points that can be gained from each question
 */
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

module.exports.generateQuestionnaire = generateQuestionnaire;