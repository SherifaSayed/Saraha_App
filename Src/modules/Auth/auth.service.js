import { User } from "../../DB/Models/index.js";
import { encrypt } from "../../Utils/encryption.utils.js";

 export const registerService= async(body)=>{

    const {firstName, lastName, email, password, gender, phoneNumber}= body;

    const checkEmailDuplicate = await User.findOne({email}).select("email");
    if(checkEmailDuplicate)
    {
        throw new Error("email duplicat error",{cause:{status:409}})
    }
    const userObject={firstName,lastName,email,password,gender};
    if(phoneNumber)
    {
        userObject.phoneNumber=encrypt(phoneNumber)
    }
    return User.create(userObject);

 }