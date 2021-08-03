const Joi = require('joi');

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