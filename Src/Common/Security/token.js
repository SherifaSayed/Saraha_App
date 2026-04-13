import jwt from "jsonwebtoken"
import envConfig from "../../config/env.config.js"
import * as commonIndex from "../index.js"
import { UserRepository } from "../../DB/Repositories/index.js";
//generate token 


  export const generateToken= ({payload , signature, options={}})=>{
  return jwt.sign(payload,signature,options);
   
  }

// verify token 

export const verifyToken= ({token , secretKey ,options={}})=>{

return jwt.verify(token, secretKey, options);

}


export const  createLoginCredentials=({payload, signature, options})=>{
const accessToken= generateToken(

    {
        payload, 
        signature,
        options
    
    }
)

  return {accessToken}
}
 

export const decodeToken=({token})=>{

  const data= jwt.decode(token)
  if(!data.role)throw new Error ('invalid payload', {cause:{status:400}})
    const {accessSignature}= detectSignatureByrole({role:data.role})

  const decodeData= verifyToken({token, secretKey:accessSignature})
  if(!decodeData.user_id) throw new Error ("invalid payload",{cause:{status:400}})
console.log(decodeData)

  return UserRepository.findDocumentById(decodeData.user_id);
}
export const detectSignatureByrole=({role})=>{
 
    let signature;
    if(role == commonIndex.User_Roles.ADMIN)
       signature= envConfig.jwt.admin
    else 
        signature= envConfig.jwt.user;
    console.log(signature)
    return signature;
}


