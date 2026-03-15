import { decrypt } from '../../Utils/encryption.utils.js'
import User from '../../DB/models/user.model.js'

export const getProfileService = async (id)=>{
 
    const user = await User.findById(id);
    
    if(user.phoneNumber)
    {
        user.phoneNumber=decrypt(user.phoneNumber)
    }
   return user ;
}
