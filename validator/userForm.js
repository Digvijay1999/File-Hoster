const Joi = require('joi')

/**
 *validate input details for user registration 
 * @param {object} requestObject input from user
 * @return {Array} result of the validation 
 */
async function userRegisterValidation(requestObject) {
    let registration = Joi.object({
        name: Joi.string().max(30).required(),
        username: Joi.string().required(),
        userpassword: Joi.string().max(10).required(),
        useremail:Joi.string().max(128).required(),
        userage:Joi.number().max(200).required(),
        useraddress: Joi.string()
    }).unknown();

    let result = await registration.validate(requestObject)
    return result;
}

module.exports = {

    userRegisterValidation

}

