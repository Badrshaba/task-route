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
   validationMiddleware(validators.addTaskSchema),
  expressAsyncHandler(taskController.addTask)
);

router.put(
  "/:taskId", 
  auth(),
  validationMiddleware(validators.updateTaskSchema), 
  expressAsyncHandler(taskController.updateTask)
);
router.get(
  "/",
  auth(),
 // validationMiddleware(validators.updatetaskSchema),
  expressAsyncHandler(taskController.getAllTasks)
);
router.get(
  "/:taskId",
  auth(),
  validationMiddleware(validators.getTaskByIdSchema),
  expressAsyncHandler(taskController.getTask)
);
router.delete(
  "/:taskId",
  auth(),
  validationMiddleware(validators.deleteTaskSchema),
  expressAsyncHandler(taskController.deleteTask)
);



export default router;
