import { Router } from "express";
import * as userServer from './User.service.js'
import { authenticate, authorize } from "../../middlewares/index.js";
const userController =Router();

userController.get('/profile',authenticate,async(req, res, next)=>{

const data= await userServer.getProfileService(req.user);
res.json(data);

})

userController.put('/update',authenticate ,async(req ,res)=>{

const user=await userServer.updateProfileService(req.user, req.body);
 res.status(201).json({userData:user});
})
 userController.delete("/:id", async(req, res, next)=>{

  const userData= await userServer.deletUserAcountSoft(req.params.id);
   res.status(200).json({userData});

 })
  userController.get('/listall',authenticate,authorize,async(req, res, next)=>{

  const users= await userServer.getAllUsers();
   res.status(200).json(users)

  })

  
export default userController;