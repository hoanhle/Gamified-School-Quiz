'use strict';

const managementView= require('../models/managementView');
const db = require('../controllers/db')

module.exports = {
    /**
     * Prints managemenView page
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async showManagementView(request, response) {
      let questionaires = await db.getAllQuestionnaires() 
      console.log(questionaires)
      response.render('managementView', questionaires)
    },


};
