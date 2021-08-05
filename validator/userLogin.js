const Joi = require('joi');

/**
 *validates the user input for login page  
 * @param {object} requestObject user input
 * @return {Array} result of the validation
 */
async function validateLoginDetails(requestObject) {
    loginCredentials = Joi.object({
        username: Joi.string().max(20).trim().required(),
        userpassword: Joi.string().max(10).required()
    })

    let result = await loginCredentials.validate(requestObject)
    return result;
}

module.exports = {
    validateLoginDetails
}