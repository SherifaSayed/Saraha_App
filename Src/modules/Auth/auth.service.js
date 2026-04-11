import { encrypt } from "../../Common/Security/encryption.js";
import UserRepository from "../../DB/Repositories/user.repo.js";
import envConfig from "../../config/env.config.js";
import * as securityIndex from '../../Common/index.js'
import User from "../../DB/models/user.model.js";


const jwt_Secret_User = envConfig.jwt;
export const registerService = async (body) => {

  const { firstName, lastName, email, password, gender, phoneNumber, role } = body;

  const checkEmailDuplicate = await UserRepository.findOneDocument({ email }, { email: 1 });

  if (checkEmailDuplicate) {
    throw new Error("email duplicat error", { cause: { status: 409 } })
  }
  const hashedPassword = await securityIndex.hash(password, 12);
  const userObject = { firstName, lastName, email, password: hashedPassword, gender, role };
  if (phoneNumber) {
    userObject.phoneNumber = encrypt(phoneNumber)
  }
  return UserRepository.creatDocument(userObject);

}


export const loginService = async (body) => {

  const { email, password } = body;
  const user = await UserRepository.findOneDocument({ email });
  if (!user) {
    throw new Error("User Not exesst", { cause: { status: 401 } })

  }
  const isPasswordVaild = await securityIndex.compare(password, user.password)
  if (!isPasswordVaild)
    throw new Error("Inavlid email or password", { cause: { status: 401 } });

  //Generate user token access token ;
    const signature=securityIndex.detectSignatureByrole(user.role)
   const userRole= user.role;
   let expires;
   if(userRole==securityIndex.User_Roles.ADMIN)
      expires=jwt_Secret_User.admin.tokenExpiresIn
    else 
      expires=jwt_Secret_User.user.tokenExpiresIn

  const { accessToken } =securityIndex.createLoginCredentials({
    payload: { sup: user.firstName, user_id: user._id, role: user.role },
    
    signature: signature,
    options: {
      expiresIn: expires /* 1d*/,
      issuer: "http://localhost:3000"
    }
  })
  return accessToken;
}