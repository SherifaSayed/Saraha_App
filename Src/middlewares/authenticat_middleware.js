import { decodeToken } from "../Common/index.js";


export const authenticate=async(req, res, next)=>{
const {authorization}= req.headers;

if(!authorization)
{
    throw new Error ('Authorization header is required',{cause:{status:400 }})
}

const user = await decodeToken({token:authorization});
if(!user)
{
    throw new Error ('user not found please register',{cause:{status:401}})
}
 req.user=user;
 next();
     
}