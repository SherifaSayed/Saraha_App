import jwt from "jsonwebtoken"
import envConfig from "../../config/env.config.js"
import * as commonIndex from "../index.js"
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
 

export const detectSignatureByrole=(role)=>{
 
    let signature;
    if(role == commonIndex.User_Roles.ADMIN)
       signature= envConfig.jwt.admin.accessSignatureAdmin
    else 
        signature= envConfig.jwt.user.accessSignatureUser;
    console.log(signature)
    return signature;
}



export const decodeToken=(token)=>{

  const decode= jwt.decode(token);
  const {role}=decode;
  return role;
}