const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { number } = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

module.exports.userRegisterSchema = Joi.object({
	users: Joi.object({
		username: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		fName: Joi.string().required(),
		lName: Joi.string().required(),
		phoneNumber: myCustomJoi.string().phoneNumber({ defaultCountry: 'JO', strict: true })
	}).required()
});

// module.exports.reviewSchema = Joi.object({
// 	review: Joi.object({
// 		rating: Joi.number().required().min(1).max(5),
// 		body: Joi.string().required()
// 	}).required()
// })
