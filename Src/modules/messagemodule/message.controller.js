import { Router } from "express";
import * as messageService from "./message.service.js"
const messageController =Router();

messageController.post('/send',async(req,res)=>{

const result = await messageService.sendMessage(req.body);
res.status(201).json({result})

})


export default messageController;