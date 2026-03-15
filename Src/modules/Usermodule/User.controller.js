import { Router } from "express";
import * as userServer from './User.service.js'
const userController =Router();

userController.get('/:id',async(req, res, next)=>{

const data= await userServer.getProfileService(req.params.id);
res.json(data);

})


export default userController;