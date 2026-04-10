import { decrypt } from '../../Common/Security/encryption.js'
import User from '../../DB/models/user.model.js'
import {UserRepository} from '../../DB/Repositories/index.js'
import { Types } from 'mongoose'
import envConfig from '../../config/env.config.js'
import jwt from "jsonwebtoken"
export const getProfileService = async (req)=>{
 

  const accessToken= req.headers.authorization
 const decodedData= jwt.verify(accessToken,envConfig.jwt.accessSignature )
 
 console.log(decodedData);
    const user = await User.findById(user_id);
    
    if(user.phoneNumber)
    {
        user.phoneNumber=decrypt(user.phoneNumber)
    }
   return user ;
}
export const updateProfileService=(id,body)=>{
  const allowedFields =["firstName", "lastName", "phoneNumber", "password"];
  const objectId = new Types.ObjectId(id);
  let data={};
   Object.keys(body).forEach((key)=>{
    if(allowedFields.includes(key))
        data[key]=body[key];
   })
  if(Object.keys(data).length===0)
    throw new Error("No valid data to update");
  return  UserRepository.updateDocumentById(objectId, data);

}
export const deletUserAcountSoft= (id)=>{
  const _id= new Types.ObjectId(id)
 const userData=UserRepository.softDeleteDocumentById(_id);
 return userData;
}

