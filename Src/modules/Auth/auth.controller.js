import { Router } from "express";
import * as authService from './auth.service.js'
const authController =Router();

authController.get("/",(req, res, next)=>{
   res.status(200).json("router test")
})
 authController.post('/register',async(req,res, next)=>{
   const result = await authService.registerService(req.body)
    res.status(201).json({message:"User registerd successfully",result});  
 });
export default authController;