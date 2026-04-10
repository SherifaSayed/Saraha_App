import { Router } from "express";
import * as messageService from "./message.service.js"
const messageController =Router();

messageController.post('/send',async(req,res)=>{

const result = await messageService.sendMessage(req.body);
res.status(201).json({result})

})
messageController.get('/list/:id',async(req ,res , next)=>{

const result= await messageService.userMessages(req.params.id);
res.status(200).json(result);

})

export default messageController;