import {UserRepository} from '../../DB/Repositories/index.js'
import { Types } from 'mongoose'
import envConfig from '../../config/env.config.js'
import * as securityIndex from '../../Common/index.js'

const decodedUserToken=async({token , role})=>{
  const secretKey=securityIndex.detectSignatureByrole(role)
const decodedData=securityIndex.verifyToken({token,secretKey})
 const {user_id}=decodedData; 
 return UserRepository.findDocumentById(user_id);
  
}

export const getProfileService = async (headers)=>{
    const accessToken= headers.authorization
    const role= securityIndex.decodeToken(accessToken);
    const user = await decodedUserToken({token:accessToken,role})
    if(!user)
      throw new Error('user not found', {cause:{status:400}})
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

