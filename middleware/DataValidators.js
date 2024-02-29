const joi = require('joi');
const loginCredentialvalidator = (req, res, next) => {
    const joiSchema = joi.object({
        email: joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "in"] }
        }).min(5).max(60).required(),
        password: joi.string().min(2).max(30).required(),
    }).options({ abortEarly: false, allowUnknown: true });
    const { error, value } = joiSchema.validate(req.body);
    if (error) {
        req.flash('error',`${error.details[0].message}`);
        res.redirect('/login');
    } else {
        next();
    }
}
const signUpDataValidator = (req,res,next)=>{
    const joiSchema = joi.object({
        name:joi.string().min(3).max(60).required(),
        email: joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "in"] }
        }).min(5).max(60).required(),
        password: joi.string().min(2).max(30).required(),
    }).options({ abortEarly: false, allowUnknown: true });
    const { error, value } = joiSchema.validate(req.body);
    if (error) {
        // console.log(error);
        req.flash('error',`${error.details[0].message}`);
        res.redirect('/signup');
    } else {
        next();
    }
}
module.exports = {
    loginCredentialvalidator,
    signUpDataValidator,
}