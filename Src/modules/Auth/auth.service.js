import { User } from "../../DB/Models/index.js";
import { encrypt } from "../../Common/Security/encryption.js";
import { compare, hash } from "../../Common/index.js";
 export const registerService= async(body)=>{

    const {firstName, lastName, email, password, gender, phoneNumber}= body;

    const checkEmailDuplicate = await User.findOne({email}).select("email");
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
    return User.create(userObject);

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