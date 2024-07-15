import Category from "../../../DB/models/Category.model.js";
import Task from "../../../DB/models/Task.model.js";
import { APIFeature } from "../../utils/api-features.js";
//================================ add category ================================//
/**
 * * detructure the required data from request body and request headers
 * * check in name is duplicated
 * * generate the category object
 * * create the category document
 * * response successfully created
 */
export const addCategory = async (req, res, next) => {
  // * destructuring the data from the request body and authUser
  const { name } = req.body;
  const { _id } = req.authUser;

  // * check in name is duplicated
  const isNameDuplicated = await Category.findOne({ name });
  if (isNameDuplicated)
    return next(new Error("name category is duplicated", { cause: 400 }));

  // * generate the category object
  const category = {
    name,
    createdBy: _id,
  };

  // * create the category document
  const categoryDocument = await Category.create(category);
  if (!categoryDocument) {
    return next(new Error("category isn't created", { cause: 400 }));
  }
  // * response successfully created
  res.status(201).json({
    success: true,
    message: "Category created successfully",
  });
};

//================================ update category ================================//
/**
 * * destructure name from the request body
 * * destructure category id from the request params
 * * destructure _id from the request authUser
 * * check if category exists
 * * check is user wants to update name category
 * * set value for the updatedBy
 * * save values
 * * success response
 */
export const updateCategory = async (req, res, next) => {
  // * destructure name and oldPublicId from the request body
  const { name } = req.body;
  // * destructure category id from the request params
  const { categoryId } = req.params;
  // * destructure _id from the request authUser
  const { _id } = req.authUser;

  // * check if category exists
  const category = await Category.findOne({ createdBy: _id, _id: categoryId });
  if (!category) return next(new Error(`Category not found`, { cause: 404 }));

  // * check is user wants to update name category
  if (name) {
    // * check if new name === old name
    if (category.name === name) {
      return next(
        new Error(`please enter different name from the existing one.`, {
          cause: 404,
        })
      );
    }

    // * check if new name not already existing
    const isNameDuplicated = await Category.findOne({ name });
    if (isNameDuplicated) {
      return next(new Error(`please enter different name.`, { cause: 400 }));
    }

    // * update name and slug category
    category.name = name;
  }

  // * save values
  await category.save();

  // * success response
  res.status(200).json({ success: true, message: "Successfully updated" });
};



//================================ get category ================================//
/**
 * * destructure category id from the request params
 * * find category by id populate tasks
 * * check is category found
 * * success response
 */

export const getCategory = async (req, res, next) => {
// destructure category id from the request params
  const { categoryId } = req.params;
// find category by id populate tasks
  const category = await Category.findById(categoryId).populate(
    [
        {
            path: 'tasks',
        }
    ]
);
// check is category found
  if (!category) {
    return next(new Error(`Category not found`, { cause: 404 }));
  }
 // success response
  res.status(200).json({
    success: true,
    message: "Successfully Get Category",
    date: category,
  });
};

//================================ delete category ================================//
/**
 * * destructure category id from the request params
 * * delete category by id populate tasks
 * * check is category deleted
 * * delete tasks related for category
 * * check is tasks deleted
 * * success response
 */

export const deleteCategory = async (req, res, next) => {
 // destructure category id from the request params
  const { categoryId } = req.params;
 // check is category deleted
  const category = await Category.findByIdAndDelete(categoryId);
 // check is category deleted
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  //  delete tasks related for category
  const tasksLen = await Task.find({ categoryId });
  if (tasksLen.length) {
    const tasks = await Task.deleteMany({ categoryId });
 // check is tasks deleted
    if (!tasks.deletedCount) {
      return next(
        new Error("failed deleted tasks this category", { cause: 400 })
      );
    }
  }

  // * response successfully
  res.status(200).json({ success: true, message: "Successfully deleted" });
};




//================================ get all categories with panation and sort ================================//
// * destructuring data from query
// * get all categories
 // * success response
 export const getAllCategories = async (req, res, next) => {
  // * destructuring data from query
  const { page, size, sort, ...search } = req.query;

  // * get all categories
  const features = new APIFeature(req.query, Category.find())
    .pagination({
      page,
      size,
    })
    .sort(sort);

  const categories = await features.mongooseQuery;

  // * success response
  res.status(200).json({ success: true, data: categories });
};
