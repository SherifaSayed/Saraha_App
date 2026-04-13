import {UserRepository} from '../../DB/Repositories/index.js'
import { Types } from 'mongoose'
import * as securityIndex from '../../Common/index.js'



export const getProfileService = async (user)=>{
    if(user.phoneNumber)
    {
        user.phoneNumber=securityIndex.decrypt(user.phoneNumber)
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

