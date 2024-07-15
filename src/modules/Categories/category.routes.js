import { Router } from "express";
import * as categoryController from "./category.controller.js";
import expressAsyncHandler from "express-async-handler";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import * as validators from "./category.validation.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  auth(),
   validationMiddleware(validators.addCategorySchema),
  expressAsyncHandler(categoryController.addCategory)
);

router.put(
  "/:categoryId",
  auth(),
   validationMiddleware(validators.updateCategorySchema),
  expressAsyncHandler(categoryController.updateCategory)
);
router.get(
  "/",
  expressAsyncHandler(categoryController.getAllCategories)
); 
router.get(
  "/:categoryId",
  auth(),
   validationMiddleware(validators.getCategorySchema),
  expressAsyncHandler(categoryController.getCategory)
);
router.delete(
  "/:categoryId",
  auth(),
  validationMiddleware(validators.getCategorySchema),
  expressAsyncHandler(categoryController.deleteCategory)
);

export default router;
