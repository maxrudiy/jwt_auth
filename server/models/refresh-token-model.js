import { model, Schema } from "mongoose";

const RefreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("RefreshToken", RefreshTokenSchema);
