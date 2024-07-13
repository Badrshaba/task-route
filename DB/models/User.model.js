import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be entered"],
      minLength: [3, "name is too short"],
      maxlength: [20, "name is too long"],
      trim: true,
    },
    email: {
      type: String,
      lowerCase: true,
      trim: true,
      required: [true, "Email must be exist"],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password is too short"],
      required: [true, "Please provide a password"],
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
