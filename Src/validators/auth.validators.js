import Joi from "joi"
import { GENDER, User_Roles } from "../Common/constants.js"
import { isValidObjectId } from "mongoose"
import { generalValidators } from "../Common/Validators/general.validator.js"



export const registerSchema={
  body:Joi.object({
    firstName:Joi.string().min(3).max(50).required(),
    lastName:Joi.string().min(3).max(50).required(),
    email:generalValidators.email.required(),
    password:generalValidators.password,
    gender:Joi.string().valid(...Object.values(GENDER)).required(),
    phoneNumber:Joi.string().length(11).required(),
    // confirmPassword:Joi.valid(Joi.ref("password")),
    // role:Joi.string().valid(...Object.values(User_Roles)),
    // isBoolian:Joi.boolean().truthy(1).falsy(0).sensitive(true),
    // skills:Joi.array().items(Joi.object({name:Joi.string(),level:Joi.valid('Beginnerr', 'Intermediate', 'Advanced')})),
    // userId:generalValidators._id
  }).with('email', 'password').with('password', 'confirmPassword')
  .options({presence:'optional'})
    
 }

 const skills= [
  {
    name:'JS',
    level:'Intermediante'
  }
  ,{
    name:'React',
    level:'Advanced'
  }
 ]