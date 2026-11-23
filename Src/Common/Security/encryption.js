import crypto from "node:crypto";
import fs from "node:fs";
import envConfig from "../../config/env.config.js";

const encryptionENV = envConfig.encription;
const encryKey = Buffer.from(encryptionENV.ENCRIPTION_KEY, "hex");

export const encrypt = (text) => {
  const iv = crypto.randomBytes(parseInt(encryptionENV.IV_LENGTH));
  const cipher = crypto.createCipheriv("aes-256-cbc", encryKey, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (inputCipher) => {
  const [iv, encryptedData] = inputCipher.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryKey,
    Buffer.from(iv, "hex"),
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

if (!fs.existsSync("publicKey.pem") || !fs.existsSync("privateKey.pem")) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  fs.writeFileSync("publicKey.pem", publicKey);
  fs.writeFileSync("privateKey.pem", privateKey);
}

export const asymmetricEncryption = (text) => {
  const publicKey = fs.readFileSync("publicKey.pem", "utf-8");
  const encryptedData = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(text),
  );
  return encryptedData.toString("hex");
};

export const asymmertricDecryption = (text) => {
  const privateKey = fs.readFileSync("privateKey.pem", "utf-8");
  const decryptedData = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(text, "hex"),
  );
  return decryptedData.toString("utf-8");
};
