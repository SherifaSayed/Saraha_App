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
    ENCRIPTION_KEY:process.env.ENC_KEY??'default-encription-key'
  }
};

export default envConfig;