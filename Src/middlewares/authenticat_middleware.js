import { decodeToken, User_Roles, TOKEN_TYPES } from "../Common/index.js";

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Error("Authorization header is required", {
      cause: { status: 401 },
    });
  }
  const [prefix, token] = authorization.split(" ");
  if (prefix !== "Bearer" || !token) {
    throw new Error("Invalid authorization format", { cause: { status: 401 } });
  }
  const { user } = await decodeToken({ token }, TOKEN_TYPES.ACCESS);
  if (!user || user.isDeleted) {
    throw new Error("User not found", { cause: { status: 401 } });
  }
  req.user = user;
  next();
};

export const authorize = (req, res, next) => {
  if (req.user.role !== User_Roles.ADMIN) {
    throw new Error("Not Allowed", { cause: { status: 403 } });
  }
  next();
};
