import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import UserRepository from "../../DB/Repositories/user.repo.js";
import envConfig from "../../config/env.config.js";
import * as securityIndex from "../../Common/index.js";

const client = new OAuth2Client();
const jwtConfig = envConfig.jwt;
const ISSUER = "http://localhost:3000";

const issueTokens = (user) => {
  return securityIndex.createLoginCredentials({
    payload: { user_id: user._id, email: user.email, role: user.role },
    options: {
      access: {
        expiresIn: jwtConfig[user.role].tokenExpiresIn,
        issuer: ISSUER,
      },
      refresh: {
        expiresIn: jwtConfig[user.role].refreshExpiration,
        issuer: ISSUER,
      },
    },
  });
};

export const registerService = async (body) => {
  const { firstName, lastName, email, password, gender, phoneNumber } = body;

  const duplicate = await UserRepository.findOneDocument({
    email,
    provider: securityIndex.PROVIDERS.SYSTEM,
  });
  if (duplicate) {
    throw new securityIndex.ConflictException("email duplicat error", {
      dublicateEmail: email,
    });
  }

  const hashedPassword = await securityIndex.hash(password);
  const userObject = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    gender,
    phoneNumber: securityIndex.encrypt(phoneNumber),
  };

  return UserRepository.creatDocument(userObject);
};

export const loginService = async (body) => {
  const { email, password } = body;
  if (!email || !password) {
    throw new securityIndex.BadRequestException(
      "email and password are required",
    );
  }

  const user = await UserRepository.findOneDocument({
    email,
    provider: securityIndex.PROVIDERS.SYSTEM,
    isDeleted: false,
  });
  if (!user) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }

  const isPasswordValid = await securityIndex.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }

  const { accessToken, refreshToken } = issueTokens(user);
  return { accessToken, refreshToken };
};

export const refreshTokenService = async ({ authorization }) => {
  if (!authorization) {
    throw new Error("Authorization header is required", {
      cause: { status: 401 },
    });
  }

  const refreshToken = authorization.replace(/^Bearer\s+/i, "");
  const { user } = await securityIndex.decodeToken(
    { token: refreshToken },
    securityIndex.TOKEN_TYPES.REFRESH,
  );
  if (!user || user.isDeleted) {
    throw new Error("User not found", { cause: { status: 401 } });
  }

  const { accessToken } = securityIndex.createLoginCredentials({
    payload: { user_id: user._id, email: user.email, role: user.role },
    options: {
      access: {
        expiresIn: jwtConfig[user.role].tokenExpiresIn,
        issuer: ISSUER,
      },
    },
    requiredToken: securityIndex.TOKEN_TYPES.ACCESS,
  });

  return { accessToken };
};

const verifyIdToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: envConfig.gcp.webCLintID,
  });
  return ticket.getPayload();
};

const getVerifiedGooglePayload = async (idToken) => {
  const payload = await verifyIdToken(idToken);
  if (!payload || !payload.email_verified) {
    throw new Error(
      "Your account is not authorized please contact google service",
      {
        cause: { status: 401 },
      },
    );
  }
  return payload;
};

const findGoogleUser = (payload) => {
  return UserRepository.findOneDocument({
    $or: [{ googleSub: payload.sub }, { email: payload.email }],
    provider: securityIndex.PROVIDERS.GOOGLE,
    isDeleted: false,
  });
};

const handelUserUpdateOrCreation = async ({ user, payload }) => {
  const { given_name, family_name, email, sub } = payload;

  if (user) {
    return UserRepository.updateDocumentById(user._id, {
      firstName: given_name,
      lastName: family_name,
      email,
    });
  }

  const hashedPassword = await securityIndex.hash(
    crypto.randomBytes(12).toString("hex"),
  );
  return UserRepository.creatDocument({
    firstName: given_name,
    lastName: family_name,
    email,
    provider: securityIndex.PROVIDERS.GOOGLE,
    googleSub: sub,
    password: hashedPassword,
  });
};

export const gmailLoginService = async (body) => {
  const payload = await getVerifiedGooglePayload(body.idToken);
  const user = await findGoogleUser(payload);
  if (!user) {
    throw new Error("user not found", { cause: { status: 404 } });
  }
  return issueTokens(user);
};

export const gmailRegisterService = async (body) => {
  const payload = await getVerifiedGooglePayload(body.idToken);
  const user = await findGoogleUser(payload);
  const userData = await handelUserUpdateOrCreation({ user, payload });
  return issueTokens(userData);
};
