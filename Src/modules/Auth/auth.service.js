import { encrypt } from "../../Common/Security/encryption.js";
import UserRepository from "../../DB/Repositories/user.repo.js";
import envConfig from "../../config/env.config.js";
import * as securityIndex from '../../Common/index.js'
import User from "../../DB/models/user.model.js";
import {OAuth2Client} from 'google-auth-library';
import crypto from 'node:crypto'
import {hash} from '../../Common/index.js';



  const client = new OAuth2Client();
  const jwt_Secret = envConfig.jwt;
 export const registerService = async (body) => {

  const { firstName, lastName, email, password, gender, phoneNumber, role } = body;

  const checkEmailDuplicate = await UserRepository.findOneDocument({ email , provider:securityIndex.PROVIDERS.SYSTEM});

  if (checkEmailDuplicate) {
    throw new  securityIndex.ConflictException("email duplicat error",{dublicateEmail:email})
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
    payload: {  user_id: user._id,email:user.email ,role:user.role },
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
    payload: { sup:decodeData.sup, user_id: decodeData.user_id, role: decodeData.role },
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


 const verifyIdToken= async (token)=> {


  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: envConfig.gcp.webCLintID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
  const userid = payload['sub'];
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];

// verify().catch(console.error);
return payload;
 }
  const handelUserUpdateOrCreation= async({user,payLoad})=>{
    const {given_name, family_name, email}= payLoad
    if (user)
    {
      return UserRepository.updateDocumentById({
        id:user._id,
        data:{firstName:given_name, lastName:family_name, email:email},
      })
    } 
    else{
  const hashedPassword=await hash(crypto.randomBytes(12).toString('hex'))
    userData = await UserRepository.creatDocument({
    firstName: given_name,
    lastName: family_name,
    email: email,
    provider: securityIndex.PROVIDERS.GOOGLE,
    googleSub: payLoad.sub, 
    password:hashedPassword
  });
}
  }
   const buildToken = (userdata)=>{
    const { accessToken ,refreshToken} =securityIndex.createLoginCredentials({
    payload: {  user_id: userData._id,email:userData.email, role: userData.role },
    options: {
      access:{

        expiresIn:jwt_Secret[userData.role].tokenExpiresIn,
        issuer: "http://localhost:3000"
      },
      refresh:{
         expiresIn:jwt_Secret[userData.role].refreshExpiration,
        issuer: "http://localhost:3000"
      }
     
    }
  })
  return {accessToken,refreshToken};
    

   }
export const gmailLoginService= async(body)=>{

const {idToken}= body;
  
 const payLoad= await verifyIdToken(idToken);

  if(!payLoad || !payLoad.email_verified)
    throw new Error("Your account is not authorized please contavt google service", {cause:{status:401}});

     const user = await UserRepository.findOneDocument({
  $or: [
    { googleSub: payLoad.sub },
    { email: payLoad.email }
  ],
  provider: securityIndex.PROVIDERS.GOOGLE
});
if(!user)
  throw new Error("user not found",{cause:{status:404}});
  
 return buildToken(user)
}

export const gmailRegisterService= async(body)=>{

  const {idToken}= body;
  
 const payLoad= await verifyIdToken(idToken);

  if(!payLoad || !payLoad.email_verified)
    throw new Error("Your account is not authorized please contavt google service", {cause:{status:401}});

     const user = await UserRepository.findOneDocument({
  $or: [
    { googleSub: payLoad.sub },
    { email: payLoad.email }
  ],
  provider: securityIndex.PROVIDERS.GOOGLE
});


const userData= await handelUserUpdateOrCreation({user, payLoad});

return  buildToken(userData)
}