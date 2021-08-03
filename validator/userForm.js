const Joi = require('joi')

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

