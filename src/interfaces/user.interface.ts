import mongoose from "mongoose";
import { Role } from "../utils";

export interface BaseUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
}

export interface UserType extends BaseUser {
  _id?: mongoose.Types.ObjectId;
  authType: string;
  isVerified: boolean;
}
