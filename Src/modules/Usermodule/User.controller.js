import { Router } from "express";
import * as userServer from './User.service.js'
const userController =Router();

userController.get('/profile',async(req, res, next)=>{

const data= await userServer.getProfileService(req.headers);
res.json(data);

})

userController.patch('/update/:id', async(req ,res)=>{

const user=await userServer.updateProfileService(req.params.id, req.body);
 res.status(201).json({userData:user});
})
 userController.delete("/:id", async(req, res, next)=>{

  const userData= await userServer.deletUserAcountSoft(req.params.id);
   res.status(200).json({userData});

 })
export default userController;