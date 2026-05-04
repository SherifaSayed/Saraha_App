import Joi from'Joi'
const objectId=(value, helper)=>{
return isValidObjectId(value)?value:helper.message('enter a valid ID')
}
export const generalValidators={
_id:Joi.custom(objectId),
email:Joi.string().email({tlds:{allow:['com', 'org']}, multiple:true})
    .messages({'string.email':'Email must end with .com or .org , example : exampleemail@gmail.com , exapleemail@any.org '}),
    password:Joi.string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .messages({
    'string.pattern.base':'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    'any.required': 'Password cannot be empty'
  })
}