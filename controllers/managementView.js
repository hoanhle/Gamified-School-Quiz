'use strict';

const managementView= require('../models/managementView');

module.exports = {
    /**
     * Prints exercise page
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    showManagementView(request, response) {
        // currently we use only the default exercise here
        response.render('managementView');
    },

    /**
     * gradeExercise returns a grade for answer
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */

};
