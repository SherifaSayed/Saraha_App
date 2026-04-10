import { Types } from "mongoose";
import MessageRepository from "../../DB/Repositories/message.repo.js";

export const sendMessage=(body)=>{

const {content, receiverId}=body;

return MessageRepository.creatDocument({content, receiverId});

}

export const userMessages= (id)=>{
const userId=new Types.ObjectId(id);
const message= MessageRepository.findDocument({receiverId: userId},{content:1,receiverId:1})
return message;

}