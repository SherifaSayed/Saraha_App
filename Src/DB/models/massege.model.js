import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: { name: "idx_receiverId" },
    },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
