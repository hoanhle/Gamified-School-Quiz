'use strict';

const managementView= require('../models/managementView');
const db = require('../controllers/db')
const url = require('url');

module.exports = {
    //=====================================================================================
    //            Questionaire management
    //=====================================================================================
    /**
     * Prints managemenView page
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async showManagementView(request, response) {
      let questionaires = await db.getAllQuestionnaires();
      response.render('managementView', {questionaires: questionaires, questionaire: false});
    },
  

    /**
     * Prints managementView with specific questionaires information
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async showQuestionaire(request, response) {
      if (checkId(request.query.id)){
        let questionaire = await db.getQuestionnaire(request.query.id); 
        let questionaires = await db.getAllQuestionnaires();
        response.render('managementView', 
          {
            questionaires: questionaires,
            questionaire: questionaire
          });
      } else {
        request.flash('errorMessage', `Questionaire not found (id: ${request.query.id})`);
        return response.redirect('/management');
      }
    },


    /**
     * Print confirmation page for deleteting the whole questionaire 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async Delete(request, response) {
      if(checkId(request.params.id)){
        let questionaire = await db.getQuestionnaire(request.params.id); 
        response.render('confirmation_message', {
          token: request.csrfToken(),
          id: questionaire.id,
          name: questionaire.title
        });
        
      } else {
        request.flash('errorMessage',`Questionaire not found (id: ${request.params.id})`);
        return response.redirect('/management');
      }
    },
    
    /**
     * Edit an existing questionaire title.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async edit (request,response){
      if (check(request.body)) {
        let questionaire = await db.getQuestionnaire(request.params.id);
        questionaire.title = request.body.title;
        await db.updateQuestionnaire(request.params.id, questionaire);
        request.flash('successMessage', 'Edit saved');
        return response.redirect('back');
      } 
      else {
        request.flash('errorMessage', "Invalid format Questionaire");
        return response.redirect('back');
      }
    },
    
    /**
     * Do the action for actually deleting a questionaire. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async processDelete(request, response){
      await db.deleteQuestionnaire(request.params.id);
      request.flash('successMessage', 'Questionaire removed successfully.');
      response.redirect('/management');
    },

    //=====================================================================================
    //            Question management
    //=====================================================================================
    /**
     * Add a question to the currently active questionaire. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async addQuestion(request, response){
      if (check(request.body)) {
        let options = createArrayFromBody(request.body);
        await db.addQuestion(request.params.id, request.body.Question, options, options.length);
        request.flash('successMessage', 'Question was added successfully.');
        return response.redirect('back');
      } else {
      }
    },
    
    /**
     * Edit an existing question. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     * TODO
     */
    async editQuestion (request,response){
      if (check(request.body)) {
        request.flash('successMessage', 'Edit saved');
        return response.redirect('back');
      } 
      else {
        request.flash('errorMessage', "Invalid format for question");
        return response.redirect('back');
      }
    },

    /**
     * Delete an existing question. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     * TODO
     */
    async deleteQuestion (request,response){
      if (check(request.body)) {
        request.flash('successMessage', 'Edit saved');
        return response.redirect('back');
      } 
      else {
        request.flash('errorMessage', "Invalid format for question");
        return response.redirect('back');
      }
    },
};


function checkId(id){
  let r = /[a-f0-9]{24}/;
  if (r.test(id)) return true;
  return false;
}


/*
  Only allow user input that consists of letters numbers,
  mathematical symbols ()[]{}<>+-/*^ % € / question mark
  exclamation mark.
*/
function checkUserInput(input) {
  let r = /[a-zA-Z0-9\(\)\[\]\{\}\+\-\/\*\^\%\? ,<>!€=]+/;
  if (r.test(input)) return true;
  return false;
}
  
  
function check(answers) {
  for(let key in answers) {
    if(answers.hasOwnProperty(key)){
      if (!checkUserInput(answers[key])) {
        return false; 
      }
    }
  }  
  return true;
}


/**
  Creates an array from the body of the request that holds the options
  Assumes: that check has been node to the body.
*/
function createArrayFromBody(body) {
  let result = [];
  for (let key in body) {
    if (key !== 'Question') {
      if (key === '1')  {
        result.push({
          option: body[key],
          correctness: true
        });
      } else {
        result.push({
          option: body[key],
          correctness: false 
        });
      }
    }
  }
  return result;

}
