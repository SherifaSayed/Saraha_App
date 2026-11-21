import { Router } from "express";
import * as userService from './User.service.js'
import { authenticate, authorize, multerLocal } from "../../middlewares/index.js";
const userController =Router();

userController.get('/profile',authenticate,async(req, res, next)=>{

const data= await userService.getProfileService(req.user);
res.json(data);

})

userController.put('/update',authenticate ,async(req ,res)=>{

const user=await userService.updateProfileService(req.user, req.body);
 res.status(201).json({userData:user});
})
 userController.delete("/:id", async(req, res, next)=>{

  const userData= await userService.deletUserAcountSoft(req.params.id);
   res.status(200).json({userData});

 })
  userController.get('/listall',authenticate,authorize,async(req, res, next)=>{

  const users= await userService.getAllUsers();
   res.status(200).json(users)

  })
userController.patch('/upload/profile', authenticate,multerLocal().single("profilePicture"), async(req ,res , next)=>{

  console.log(req.file);
// const result = await userService.uploadProfilePicture();
res.status(200).json({message:"profile picture uploaded successfully"})

})
  
export default userController;