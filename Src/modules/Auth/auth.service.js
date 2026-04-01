import { User } from "../../DB/models/index.js";
import { encrypt } from "../../Common/Security/encryption.js";
import { compare, hash } from "../../Common/index.js";
import UserRepository  from "../../DB/Repositories/user.repo.js";
 export const registerService= async(body)=>{

    const {firstName, lastName, email, password, gender, phoneNumber}= body;

    const checkEmailDuplicate = await UserRepository.findOneDocument({email},{email:1});
    console.log(checkEmailDuplicate);
    if(checkEmailDuplicate)
    {
        throw new Error("email duplicat error",{cause:{status:409}})
    }
     const hashedPassword= await hash(password,12); 
    const userObject={firstName,lastName,email,password:hashedPassword,gender};
    if(phoneNumber)
    {
        userObject.phoneNumber=encrypt(phoneNumber)
    }
   return UserRepository.creatDocument(userObject);

 }
 export const loginService = async(body)=>{

const {email, password}= body;
const user= await User.findOne({email});
if(!user)
{
    throw new Error("Invalid email or password",{cause:{status:401}})

}
 const isPasswordVaild= await compare(password, user.password)
 if(!isPasswordVaild)
    throw new Error("Inavlid email or password",{cause:{status:401}});
    return user;

 }