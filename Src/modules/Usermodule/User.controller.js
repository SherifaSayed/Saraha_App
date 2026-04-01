import { Router } from "express";
import * as userServer from './User.service.js'
const userController =Router();

userController.get('/:id',async(req, res, next)=>{

const data= await userServer.getProfileService(req.params.id);
res.json(data);

})

userController.patch('/update/:id', async(req ,res)=>{

const user=await userServer.updateProfileService(req.params, req.body);
 res.status(201).json({userData:user});
})
export default userController;