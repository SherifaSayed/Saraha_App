import { encrypt } from "../../Common/Security/encryption.js";
import UserRepository from "../../DB/Repositories/user.repo.js";
import envConfig from "../../config/env.config.js";
import * as securityIndex from '../../Common/index.js'
import User from "../../DB/models/user.model.js";


const jwt_Secret = envConfig.jwt;
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
  const { accessToken ,refreshToken} =securityIndex.createLoginCredentials({
    payload: { sup: user.firstName, user_id: user._id, role: user.role },
    options: {
      access:{

        expiresIn:jwt_Secret[user.role].tokenExpiresIn,
        issuer: "http://localhost:3000"
      },
      refresh:{
         expiresIn:jwt_Secret[user.role].refreshExpiration,
        issuer: "http://localhost:3000"
      }
     
    }
  })
  return {accessToken,refreshToken};
}

export const refreshTokenService=async(header)=>{

const {authorization:refreshToken}= header;
 const {decodeData}= await securityIndex.decodeToken({token:refreshToken}, securityIndex.TOKEN_TYPES.REFRESH)
  const { accessToken} =securityIndex.createLoginCredentials({
    payload: { sup:decodeData.firstName, user_id: decodeData.user_id, role: decodeData.role },
    options: {
      access:{

        expiresIn:jwt_Secret[decodeData.role].tokenExpiresIn,
        issuer: "http://localhost:3000"
      }
    },
    requiredToken:securityIndex.TOKEN_TYPES.ACCESS
  })
   return {accessToken};
}