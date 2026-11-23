import { UserRepository } from "../../DB/Repositories/index.js";
import * as securityIndex from "../../Common/index.js";

export const getProfileService = async (user) => {
  const data = user.toJSON();
  if (data.phoneNumber) {
    data.phoneNumber = securityIndex.decrypt(data.phoneNumber);
  }
  return data;
};

export const updateProfileService = async (user, body) => {
  const { firstName, lastName, phoneNumber, gender, email } = body;

  const data = Object.fromEntries(
    Object.entries({ firstName, lastName, gender, email }).filter(
      ([, value]) => value !== undefined,
    ),
  );

  if (phoneNumber) {
    data.phoneNumber = securityIndex.encrypt(phoneNumber);
  }

  if (email) {
    const existingUser = await UserRepository.findOneDocument({
      email,
      provider: user.provider,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      throw new securityIndex.ConflictException("Email already exists");
    }
  }

  return UserRepository.updateDocumentById(user._id, data);
};

export const deletUserAcountSoft = async (requester, id) => {
  const isAdmin = requester.role === securityIndex.User_Roles.ADMIN;
  if (!isAdmin && String(requester._id) !== id) {
    throw new Error("Not Allowed", { cause: { status: 403 } });
  }

  const user = await UserRepository.softDeleteDocumentById(id);
  if (!user) {
    throw new securityIndex.NotFoundException("User not found");
  }
  return { _id: user._id, isDeleted: user.isDeleted };
};

export const getAllUsers = () => {
  return UserRepository.findDocument({ isDeleted: false });
};
