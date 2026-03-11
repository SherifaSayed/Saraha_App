import { User } from "../../DB/Models/index.js";

 export const registerService= async(body)=>{

    const {firstName, lastName, email, password, gender}= body;

    const checkEmailDuplicate = await User.findOne({email}).select("email");
    if(checkEmailDuplicate)
    {
        throw new Error("email duplicat error",{cause:{status:409}})
    }
    return User.create({firstName,lastName,email,password,gender});

 }