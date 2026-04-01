import { decrypt } from '../../Common/Security/encryption.js'
import User from '../../DB/models/user.model.js'
import {UserRepository} from '../../DB/Repositories/index.js'
import { Types } from 'mongoose'

export const getProfileService = async (id)=>{
 
    const user = await User.findById(id);
    
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