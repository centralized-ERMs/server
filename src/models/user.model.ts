import mongoose from "mongoose";
import { PASSWORD_REGEX } from "../config/constants";
import { UserType } from "../interfaces/user.interface";
import { Role } from "../utils";

const userSchema = new mongoose.Schema<UserType>(
  {
    firstName: {
      type: String,
      required: true,
      max: 60,
      min: 1,
    },
    lastName: {
      type: mongoose.SchemaTypes.String,
      required: true,
      max: 60,
      min: 1,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      index: true,
      required: true,
      unique: true,
      minlength: [3, "Must have at least 3 characters"],
      maxlength: [60, "Must have at most 25 characters"],
      validate: {
        validator: (str: string) => {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(str);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: false,
      minlength: [8, "Must have at least 8 characters"],
      maxlength: [100, "Must have at most 100 characters"],
      validate: {
        validator: (str: string) => {
          return new RegExp(PASSWORD_REGEX).test(str);
        },
        message: (props) => `${props.value} is not a valid password!`,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    authType: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: Role.None,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
