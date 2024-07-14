import { Router } from "express";
import * as userController from "./user.controller.js";
import expressAsyncHandler from "express-async-handler";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import * as validators from "./user.validation.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/signUp",
  validationMiddleware(validators.signUpSchema),
  expressAsyncHandler(userController.signUp)
);
 
router.post(
  "/signin",
  validationMiddleware(validators.signInSchema),
  expressAsyncHandler(userController.login)
);

router.delete(
  "/",
   auth(),
  expressAsyncHandler(userController.deleteUser)
);

export default router;
