'use strict';

const db = require('../controllers/db');
const root ='/management';

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
        const questionaires = await db.getAllQuestionnaires();
        response.render('managementView', {
            csrfToken: request.csrfToken(),
            questionaires: questionaires, 
            questionaire: false}
        );
    },
  

    /**
     * Prints managementView with specific questionaires information
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async showQuestionaire(request, response) {
        if (checkId(request.query.id)){
            const questionaire = await db.getQuestionnaire(request.query.id); 
            const questionaires = await db.getAllQuestionnaires();
            response.render('managementView', 
                {
                    csrfToken: request.csrfToken(),
                    questionaires: questionaires,
                    questionaire: questionaire
                });
        } else {
            request.flash('errorMessage', `Questionaire not found (id: ${request.query.id})`);
            return response.redirect(root);
        }
    },


    /**
     * Print confirmation page for deleteting the whole questionaire 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async Delete(request, response) {
        if(checkId(request.params.id)){
            const questionaire = await db.getQuestionnaire(request.params.id); 
            response.render('confirmation_message', {
                csrfToken: request.csrfToken(),
                id: questionaire.id,
                name: questionaire.title
            });
        
        } else {
            request.flash('errorMessage', `Questionaire not found (id: ${request.params.id})`);
            return response.redirect(root);
        }
    },
    
    /**
     * Edit an existing questionaire title.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async edit(request, response){
        if (check(request.body)) {
            const questionaire = await db.getQuestionnaire(request.params.id);
            questionaire.title = request.body.title;
            await db.updateQuestionnaire(request.params.id, questionaire);
            request.flash('successMessage', 'Edit saved');
            return response.redirect('back');
        } else {
            request.flash('errorMessage', 'Invalid format Questionaire');
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
        response.redirect(root);
    },

    /**
     * Add a new questionaire.  
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async add(request, response){
        await module.exports.showManagementView(request, response);
    },

    async processAdd(request, response){
        try {
            const questionaire = createQuestionaire(request.body);
            await db.addQuestionnaire(questionaire);
            request.flash('successMessage', 'Questionnaire added successfully.');
            response.redirect('back');
        } catch(err) {
            request.flash('errorMessage', `${err.message}`);
            response.redirect('back');
        }
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
            const options = createArrayFromBody(request.body);
            if (options){
                try {
                    await db.addQuestion(request.params.id, request.body.Question, options, options.length);
                    request.flash('successMessage', 'Question was added successfully.');
                    return response.redirect('back');
                } catch (err){
                    request.flash('errorMessage', `${err.message}`);
                    return response.redirect('back');
                }
            } else {
                request.flash('errorMessage', 'Incorrect question format');
                return response.redirect('back');
            }
        } else {
            request.flash('errorMessage', 'Incorrect question format');
            return response.redirect('back');
        }
    },
    
    /**
     * Edit an existing question. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async editQuestion(request, response){
        if (check(request.body)) {
            try {
                const questionaires = await db.getAllQuestionnaires();
                const questionaire= await db.getQuestionnaire(request.params.questionaire);
                const question = await db.getQuestion(request.params.questionaire, request.params.question); 
                response.render('managementView',  
                    {
                        questionaires: questionaires,
                        question: question,
                        q_id: questionaire._id,
                        csrfToken: request.csrfToken()
                    });
            } catch (err){
                request.flash('errorMessage', `${err.message}`);
                return response.redirect('back');
            }
        } else {
            request.flash('errorMessage', 'Invalid format for question');
            return response.redirect('back');
        }
    },

    /**
     * Do the action for saving the edited question 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async processEditQuestion(request, response){
        try {
            const options = createArrayFromBody(request.body);
            await db.updateQuestion(
                request.params.questionaire,
                request.params.question,
                request.body.Question,
                options,
                request.body.points
            );
            request.flash('successMessage', 'Question edited successfully.');
            response.redirect(root);
        } catch  (err){
            request.flash('errorMessage', `${err.message}`);
            return response.redirect('back');
        }
    },

    
    /**
     * Delete an existing question. 
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async deleteQuestion(request, response){
        try {
            await db.deleteQuestion(request.params.id_questionaire, request.params.id);
            request.flash('successMessage', 'Successfully delete question');
            return response.redirect('back');
        } catch (err){
            request.flash('errorMessage', 'Questionaire must have atleast one question.');
            return response.redirect('back');
        }
    }
};


function checkId(id){
    const r = /[a-f0-9]{24}/;
    if (r.test(id)) return true;
    return false;
}


/*
  Only allow user input that consists of letters numbers,
  mathematical symbols ()[]{}<>+-/*^ % € / question mark
  exclamation mark.
*/
function checkUserInput(input) {
    // Not all of the escapes are unnecessary.
    const r = /[a-zA-Z0-9\(\)\[\]\{\}\+\-\/\*\^\%\? ,<>!€=]+/;
    if (r.test(input)) return true;
    return false;
}
  
// Check that answers and questions have the above regex.k
function check(answers) {
    for(const key in answers) {
        if (Object.prototype.hasOwnProperty.call(answers, key) && !checkUserInput(answers[key])) {
            return false; 
        }
    }  
    return true;
}


/**
  Creates an array from the body of the request that holds the options
  Assumes: that check has been node to the body.
*/

function createArrayFromBody(body) {
    const result = [];
    if (Object.prototype.hasOwnProperty.call(body, 'options')){
        const options = body.options;
    
        for (const key in options) {
            if (check( options[key].option) && check(options[key].hint)){
                if(options[key].correctness === 'on') {
                    options[key].correctness = true;
                    result.push(options[key]); 
                } else {
                    options[key].correctness = false;
                    result.push(options[key]); 
           
                }
            }
        }
        return result;
    } else {
        return false;  
    }
}


function createQuestionaire(body){
    const options = createArrayFromBody(body);
    return {
        title:  body.q_title,
        submissions: 1,
        questions: [
            {
                title: body.Question,
                maxPoints: body.points,  
                options: options 
            }
        ]
    };
}
