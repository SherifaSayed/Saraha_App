import { Router } from "express";
import * as authService from './auth.service.js'
import { responseFormatter } from "../../middlewares/unified-response-middleware.js";
const authController =Router();

authController.get("/",(req, res, next)=>{
   res.status(200).json("router test")
})
 authController.post('/register',responseFormatter(async(req,res, next)=>{
   const result = await authService.registerService(req.body)
   return {message:"user registerd", data:result, meta:{statusCode:201}}
 }));
 authController.post('/login',responseFormatter(async(req, res, next)=>{

   const result = await authService.loginService(req.body);
   res.status(200).json({message:"User logged in successfully", token:result});
 }))

 authController.post('/refresh-token', responseFormatter(async(req, res, next)=>{
   const result =  await authService.refreshTokenService(req.headers);
   res.status(200).json(result);
  }))

authController.post('/gmail/login',responseFormatter(async(req, res)=>{
const result = await authService.gmailLoginService(req.body);
res.status(201).json({message:"User logged in successfully",data: result})
}) )


authController.post('/gmail/register',responseFormatter(async(req, res)=>{
const result = await authService.gmailRegisterService(req.body);
res.status(200).json({message:"User logged in successfully", ...result})
}) )



export default authController;