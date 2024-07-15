import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../DB/models/User.model.js";
import Category from "../../../DB/models/Category.model.js";
import Task from "../../../DB/models/Task.model.js";

//============================= Sign In =============================//
/**
 * * destructuring the data from the request body
 * * check if email already exist
 * * hash the password
 * * User object
 * * create new user
 * * response success
 */
export const signUp = async (req, res, next) => {
  // * destructuring the data from the request body
  const { name, email, password } = req.body;

  // * check if email already exist
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next(
      new Error("Email already exists", {
        cause: 409,
      })
    );
  }

  // * hash the password
  const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);

  // * User object
  const user = {
    name,
    email,
    password: hashedPassword,
  };

  // * create new user
  const newUser = await User.create(user);

  if (!newUser) return next(new Error(`user not created`, { cause: 404 }));

  // * response success
  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
};

//============================= Sign In =============================//
/**
 * * destructure data from body
 * * check if email already exists
 * * check if password matched
 * * generate token for user
 * * response successfully
 */
export const login = async (req, res, next) => {
  // * destructure data from body
  const { email, password } = req.body;

  // * check if email already exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid login credentials", { cause: 404 }));
  }

  // * check if password matched
  const passwordMatched = bcrypt.compareSync(password, user.password);
  if (!passwordMatched) {
    return next(new Error("Password mismatch", { cause: 404 }));
  }

  // * generate token for user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_LOGIN, {
    expiresIn: process.env.JWT_EXPIRED_LOGIN,
  });

  // * save token
  user.token = token;
  await user.save();

  // * response successfully
  res.status(200).json({ message: "logged in successfully", data: { token } });
};

//============================= delete user =============================//
/**
 * * destructure the user data from request headers
 * * find the user and delete them from the database
 * * delete caregories and tasks created by this user
 * * response successfully
 */
export const deleteUser = async (req, res, next) => {
  // * destructure the user data from request headers
  const { _id } = req.authUser;

  // * find the user and delete them from the database
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // * delete Categories
  const categoriesLen = await Category.find({createdBy: _id })
  if (categoriesLen.length) {
    const categories = await Category.deleteMany({ createdBy: _id });
    if (!categories.deletedCount) {
      return next(
        new Error(" failed deleted categories this user", { cause: 400 })
      );
    }
  }

  // * delete tasks
  const tasksLen = await Task.find({createdBy: _id })
  if (tasksLen.length) {
    const tasks = await Task.deleteMany({ createdBy: _id });
    if (!tasks.deletedCount) {
      return next(
        new Error(" failed deleted tasks this user", { cause: 400 })
      );
    }
  }

  // * response successfully
  res.status(200).json({ success: true, message: "Successfully deleted" });
};

