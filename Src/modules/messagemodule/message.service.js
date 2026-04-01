import MessageRepository from "../../DB/Repositories/message.repo.js";

export const sendMessage=(body)=>{

const {content, receiverId}=body;

return MessageRepository.creatDocument({content, receiverId});

}