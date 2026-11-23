import {
  MessageRepository,
  UserRepository,
} from "../../DB/Repositories/index.js";
import { NotFoundException } from "../../Common/index.js";

export const sendMessage = async ({ content, receiverId }) => {
  const receiver = await UserRepository.findOneDocument({
    _id: receiverId,
    isDeleted: false,
  });
  if (!receiver) throw new NotFoundException("Receiver not found");
  const message = await MessageRepository.creatDocument({
    content,
    receiverId,
  });
  return {
    _id: message._id,
    content: message.content,
    createdAt: message.createdAt,
  };
};

export const getMyMessages = (user) =>
  MessageRepository.findDocument(
    { receiverId: user._id },
    { content: 1, createdAt: 1 },
  ).sort({ createdAt: -1 });

export const getMessageById = async (user, id) => {
  const message = await MessageRepository.findOneDocument(
    { _id: id, receiverId: user._id },
    { content: 1, createdAt: 1 },
  );
  if (!message) throw new NotFoundException("Message not found");
  return message;
};

export const deleteMessage = async (user, id) => {
  const result = await MessageRepository.hardDeletDocument({
    _id: id,
    receiverId: user._id,
  });
  if (!result.deletedCount) throw new NotFoundException("Message not found");
  return { _id: id };
};
