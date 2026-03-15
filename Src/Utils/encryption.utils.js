import crypto from "node:crypto"
import envConfig from '../config/env.config.js'
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