import envConfig from "../config/env.config.js";

 const globalErrorHandler= (err, req, res, next)=>{

   console.log("ERROR:", err);
  res.status(err?.cause?.status||500).json({

    message:err.message||"internal server error",
    // stack:envConfig.app.NODE_ENV=='dev'?err.stack:undefined,
    error:{
      code:err.code,
      details:err.details
    }
    
  })
 }

 export default globalErrorHandler
 