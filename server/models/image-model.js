import { model, Schema } from "mongoose";

const ImageSchema = new Schema({
  path: { type: String, required: true },
});

export default model("Image", ImageSchema);
