import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: {
        name: "idx_receiverId",
      },
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: {
        name: "idx_senderId",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Message =
  mongoose.model.Message || mongoose.model("Message", MessageSchema);
export default Message;
