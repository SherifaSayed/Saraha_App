import jwt from "jsonwebtoken"
import envConfig from "../../config/env.config.js"
import * as SecurityIndex from "../index.js"
import { UserRepository } from "../../DB/Repositories/index.js";
//generate token 


  export const generateToken= ({payload , signature, options={}})=>{
  return jwt.sign(payload,signature,options);
   
  }

// verify token 

export const verifyToken= ({token , secretKey ,options={}})=>{

return jwt.verify(token, secretKey, options);

}


export const  createLoginCredentials=({payload, options, requiredToken})=>{

    
    const {accessSignature, refreshSignature}=detectTokenType({role:payload.role});
    let accessToken , refreshToken;
    switch (requiredToken) {
        case SecurityIndex.TOKEN_TYPES.REFRESH:
            
            refreshToken= generateToken(
               {
               payload,
               signature:refreshSignature,
               options:options.refresh
           })
            break;
            case SecurityIndex.TOKEN_TYPES.ACCESS:
            accessToken= generateToken(
             {
                 payload, 
                 signature:accessSignature,
                 options:options.access
             
             }
            )
            break;
            default:
                 accessToken= generateToken(
             {
                 payload, 
                 signature:accessSignature,
                 options:options.access
             
             }
            )
            refreshToken= generateToken(
               {
               payload,
               signature:refreshSignature,
               options:options.refresh
           })
           break;
    }

  return {accessToken, refreshToken}
}
 

export const decodeToken=async({token}, type)=>{
  const data= jwt.decode(token)
  if(!data.role)throw new Error ('invalid payload', {cause:{status:400}})

  
   
     let signature;
     switch (type) {
        case SecurityIndex.TOKEN_TYPES.ACCESS:
            signature= detectTokenType({role:data.role},SecurityIndex.TOKEN_TYPES.ACCESS)
            
            break;
         case SecurityIndex.TOKEN_TYPES.REFRESH:
            signature= detectTokenType({role:data.role},SecurityIndex.TOKEN_TYPES.REFRESH)
            break;

        default:
            break;
     }
 
  const decodeData= verifyToken({token, secretKey:signature})
     console.log("userdata",decodeData)
  if(!decodeData.user_id) throw new Error ("invalid payload",{cause:{status:400}})
    const user= await UserRepository.findDocumentById(decodeData.user_id);
    return {user , decodeData} ;
}
export const detectSignatureByrole=({role})=>{
 
    let signature;
    if(role == SecurityIndex.User_Roles.ADMIN)
       signature= envConfig.jwt.admin
    else 
        signature= envConfig.jwt.user;
    return signature;
}

export const detectTokenType=({role}, tokentype)=>{
  const {accessSignature, refreshSignature }=detectSignatureByrole({role})
   let signature;
  switch (tokentype) {
    case SecurityIndex.TOKEN_TYPES.ACCESS:
        signature=accessSignature
        break;
     case SecurityIndex.TOKEN_TYPES.REFRESH:
        signature= refreshSignature
         break;
    default:
        return {accessSignature, refreshSignature };
        break;
  }
  return signature;
}


