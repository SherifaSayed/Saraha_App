 import './config/env.config.js'
 import express from 'express'; 
 import {User} from './DB/Models/index.js';
import envConfig from './config/env.config.js';
import dbConnection from './DB/models/db.connection.js'; 
import globalErrorHandler from "./middlewares/globelErrorHandler.js"
import * as controllers from './modules/index.js'
 const app= express();
 const port= envConfig.app.PORT ;
 app.use(express.json())
 //DataBase Connection 
 dbConnection()
//Controllers

app.use('/auth',controllers.authController);
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