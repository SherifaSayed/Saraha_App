import crypto, { privateDecrypt, publicEncrypt } from "node:crypto"
import envConfig from '../../config/env.config.js'
import fs from'node:fs'
import { buffer } from "node:stream/consumers";
const encryptionENV= envConfig.encription;
const encryKey= Buffer.from(encryptionENV.ENCRIPTION_KEY,'hex')
//================ symmetric
export const encrypt=(text)=>{

const iv= crypto.randomBytes(parseInt(encryptionENV.IV_LENGTH))
const cipher=crypto.createCipheriv('aes-256-cbc',encryKey,iv);
let encrypted = cipher.update(text,'utf-8','hex');

encrypted+= cipher.final('hex');

return `${iv.toString('hex')}:${encrypted}`
}

export const decrypt=(inputCipher)=>{
    const [iv, encryptedData]= inputCipher.split(':');
    const bufferedIV=Buffer.from(iv,'hex');
    const decripher= crypto.createDecipheriv('aes-256-cbc',encryKey,bufferedIV)
    let decrypted= decripher.update(encryptedData, 'hex', 'utf-8');

    decrypted+=decripher.final('utf-8');

    return decrypted;

}
if(fs.existsSync('publicKey.pem')&&fs.existsSync('privateKey.pem'))
{
    console.log("private and public keys genertated")
}
else{
const {publicKey, privateKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2084,
    publicKeyEncoding:{
        type:'pkcs1',
        format:'pem'
    }, 
    privateKeyEncoding:{
        type:'pkcs1',
        format:'pem'
    }
})
fs.writeFileSync('publicKey.pem',publicKey)
fs.writeFileSync('privateKey.pem',privateKey)

}
export const asymmetricEncryption=(text)=>{
    const publicKey=fs.readFileSync('publicKey.pem','utf-8');
    const bufferdText= Buffer.from(text);
    const encryptedData= crypto.publicEncrypt({
        key:publicKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      bufferdText
    )
 return  encryptedData.toString('hex');
}

export const asymmertricDecryption=(text)=>{
    const privateKey=fs.readFileSync('publicKey.pem','utf-8');
    const bufferdText= Buffer.from(text,'hex');
    const decryptedData= crypto.privateDecrypt({
        key:privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING 
      },
      bufferdText
    )
 return  decryptedData.toString('utf-8');
}