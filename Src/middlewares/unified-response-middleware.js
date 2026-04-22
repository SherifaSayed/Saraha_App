export const responseFormatter= (handler)=>{


    return async(req , res , next)=>{

      const result = await handler(req, res, next);

       if(res.headerSent) return ;
      return res.status(result?.meta?.statusCode).json({
       succes:true,
       message:result?.message|| 'success',
       data: result?.data||result,
       meta:result?.meta||{}

      })
    }
}