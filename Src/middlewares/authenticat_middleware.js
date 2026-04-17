import { decodeToken, User_Roles , TOKEN_TYPES} from "../Common/index.js";


export const authenticate=async(req, res, next)=>{
const {authorization}= req.headers;

if(!authorization)
{
    throw new Error ('Authorization header is required',{cause:{status:400 }})
}
const [prefix, token]= authorization.split(' ');

switch(prefix){
case 'Basic':
    const [email, password]= Buffer.from(token, 'base64').toString('utf-8').split(':');
     break;
 case 'Bearer':  
         const {user} = await decodeToken({token},TOKEN_TYPES.ACCESS);
         if(!user)
         {
             throw new Error ('user not found please register',{cause:{status:401}})
         }
          req.user=user;
          break;
          default:
            break;
}
 
 next();
     
}


export const  authorize =(req , res , next)=>{ // just for admin

const userRole = req.user.role;
console.log(req.user)
if(userRole!=User_Roles.ADMIN)
    throw new Error("Not Allowed",{cause:{status:401 }});
    
    next();
}