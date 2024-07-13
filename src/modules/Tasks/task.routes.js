import { Router } from "express";
import * as taskController from "./task.controller.js";
import expressAsyncHandler from "express-async-handler";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import * as validators from "./task.validation.js";
import { auth } from "../../middlewares/auth.middleware.js";


const router = Router();

router.post(
  "/",
   auth(),
  // validationMiddleware(validators.addtaskSchema),
  expressAsyncHandler(taskController.addTask)
);

router.put(
  "/:taskId",
  auth(),
 // validationMiddleware(validators.updatetaskSchema),
  expressAsyncHandler(taskController.updateTask)
);

export default router;
