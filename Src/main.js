 import './config/env.config.js'
 import express from 'express'; 
import envConfig from './config/env.config.js';
import dbConnection from './DB/db.connection.js'; 
import globalErrorHandler from "./middlewares/globelErrorHandler.js"
import * as controllers from './modules/index.js'
import { encrypt } from './Common/Security/encryption.js';
import { coreOptions } from './config/cors.config.js';
 import cors from 'cors'
 const app= express();
 const port= envConfig.app.PORT ;


 //cors middleware 

 app.use(cors(coreOptions))
 app.use(express.json())
 //DataBase Connection 
 dbConnection()
//Controllers
const encryptData= encrypt("hi");
console.log(encryptData)
app.use('/api/auth',controllers.authController);
app.use('/user', controllers.userController);
app.use('/message',controllers.messageController);




//test api
app.get('/',(req,res,next)=>{
    res.status(200).json("Saraha App is running")
})
app.use((req, res, next)=>{
    res.status(400).json({message: "Router not found"})

})
//Global error handler 
 app.use(globalErrorHandler)
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})