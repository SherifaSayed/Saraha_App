import dotenv from 'dotenv'
 dotenv.config({path:[`./.${process.env.NODE_ENV}.env`,'.env']})
console.log(process.env.PORT)
const envConfig={

app:{
    NODE_ENV:process.env.NODE_ENV ?? 'dev',
    PORT:process.env.PORT ??5000
  },
  database:{
    MONGO_URL:process.env.MONGO_URL
  },
  encription:{
    ENCRIPTION_KEY:process.env.ENC_KEY??'default-encription-key',
    IV_LENGTH:process.env.ENC_IV_LENGTH ??16
  },
  jwt:{
    user:{
      refreshSignature:process.env.JWT_REFRESH_SECRET_USER,
      refreshExpiration:process.env.JWT_REFRESH_EXP_USER,
      
      accessSignature:process.env.JWT_ACCESS_SECRET_USER,
      tokenExpiresIn:process.env.EXPIRESINUSER
    },
    admin:
    {
      refreshSignature:process.env.JWT_REFRESH_SECRET_ADMIN,
      refreshExpiration:process.env.JWT_REFRESH_EXP_ADMIN,
      
      accessSignature:process.env.JWT_ACCESS_SECRET_ADMIN,
      tokenExpiresIn:process.env.EXPIRESINADMIN
    }
  },
  cors:{
    whiteListedOrigins:process.env.CORS_WHITELISTED_ORIGINS?.split(',')

  },
  gcp :{
    webCLintID: process.env.GCP_CLIENT_ID
  }
};

export default envConfig;