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
   

export const updateProfileService=async(user, body)=>{
  const{firstName, lastName, phoneNumber, gender, email, age}= body;
  if(phoneNumber)
       user.phoneNumber= securityIndex.encrypt(user.phoneNumber);
   if(email){
     const existingUser = await UserRepository.findOneDocument({email});

     if(existingUser)
      throw new Error("Email already exists",{cause:{status:409}});     
   }
   const objectId= user._id;
  return  UserRepository.updateDocumentById(objectId, body);

}
export const deletUserAcountSoft= (id)=>{
  const _id= new Types.ObjectId(id)
 const userData=UserRepository.softDeleteDocumentById(_id);
 return userData;
}


export const getAllUsers= ()=>{
  return UserRepository.findDocument();

}

