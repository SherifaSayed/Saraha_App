import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config.js";
import * as SecurityIndex from "../index.js";
import { UserRepository } from "../../DB/Repositories/index.js";

export const generateToken = ({ payload, signature, options = {} }) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = ({ token, secretKey, options = {} }) => {
  return jwt.verify(token, secretKey, options);
};

export const detectSignatureByrole = ({ role }) => {
  return role === SecurityIndex.User_Roles.ADMIN
    ? envConfig.jwt.admin
    : envConfig.jwt.user;
};

export const detectTokenType = ({ role }, tokentype) => {
  const { accessSignature, refreshSignature } = detectSignatureByrole({ role });
  switch (tokentype) {
    case SecurityIndex.TOKEN_TYPES.ACCESS:
      return accessSignature;
    case SecurityIndex.TOKEN_TYPES.REFRESH:
      return refreshSignature;
    default:
      return { accessSignature, refreshSignature };
  }
};

export const createLoginCredentials = ({ payload, options, requiredToken }) => {
  const { accessSignature, refreshSignature } = detectTokenType({
    role: payload.role,
  });
  let accessToken;
  let refreshToken;

  switch (requiredToken) {
    case SecurityIndex.TOKEN_TYPES.REFRESH:
      refreshToken = generateToken({
        payload,
        signature: refreshSignature,
        options: options.refresh,
      });
      break;
    case SecurityIndex.TOKEN_TYPES.ACCESS:
      accessToken = generateToken({
        payload,
        signature: accessSignature,
        options: options.access,
      });
      break;
    default:
      accessToken = generateToken({
        payload,
        signature: accessSignature,
        options: options.access,
      });
      refreshToken = generateToken({
        payload,
        signature: refreshSignature,
        options: options.refresh,
      });
      break;
  }

  return { accessToken, refreshToken };
};

export const decodeToken = async ({ token }, type) => {
  const data = jwt.decode(token);
  if (!data?.role) {
    throw new Error("invalid token", { cause: { status: 401 } });
  }

  const signature = detectTokenType({ role: data.role }, type);

  let decodeData;
  try {
    decodeData = verifyToken({ token, secretKey: signature });
  } catch (error) {
    throw new Error(error.message, { cause: { status: 401 } });
  }

  if (!decodeData.user_id) {
    throw new Error("invalid payload", { cause: { status: 401 } });
  }

  const user = await UserRepository.findDocumentById(decodeData.user_id);
  return { user, decodeData };
};
