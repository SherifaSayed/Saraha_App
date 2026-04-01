 import bcrypt from 'bcrypt'
 import  argon2  from 'argon2';

 export const hash= (plainText)=>{
    return argon2.hash(plainText);
 }

 export const compare=(plainText, hashText)=>{
    return argon2.verify(hashText,plainText);
 } 