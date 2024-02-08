import { model, Schema } from "mongoose";

const GroupSchema = new Schema({
  group: { type: String },
});

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, set: (value) => value.toLowerCase() },
    password: { type: String, required: true },
    activationUrl: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    friends: { type: Array, default: [] },
    groups: { type: [GroupSchema], default: [{ group: "user" }] },
    image: { type: Schema.Types.ObjectId, ref: "Image" },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

export default model("User", UserSchema);
