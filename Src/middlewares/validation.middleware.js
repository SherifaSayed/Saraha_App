
import { BadRequestException } from "../Common/index.js";
import {registerSchema} from "../validators/index.js"

/* export const registerSchema={
  body:Joi.object({
     firstName:Joi.string().min(3).max(50).required(),
     lastName:Joi.string().min(3).max(50).required(),
     email:Joi.string().email().required(),
     password:Joi.string().min(6).required,
     gender:Joi.string().valid('male','female').required(),
     phone:Joi.string().required(),
   })
    
 } */
 const reqKeys=['body', 'query', 'params','headers']
    const validation =(schema)=>{
    return (req, res, next)=>{
         const validationErrors=[];
     for(const key in schema){
         const {error}= schema[key].validate(req[key], {abortEarly:false});
      //  console.log("hi",error)
         if(error){
        
               validationErrors.push(error.details.map(({message})=> message));
         }
     }

     if(validationErrors.length){
        throw new BadRequestException("Validation Error",{validationError:validationErrors.flat()});
     }
     next();
    }

   }

    export default validation