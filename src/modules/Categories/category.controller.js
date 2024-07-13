import Category from "../../../DB/models/Category.model.js";

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
  if(!categoryDocument){
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
 * * destructure name and oldPublicId from the request body
 * * destructure category id from the request params
 * * destructure _id from the request authUser
 * * check if category exists
 * * check is user wants to update name category
 * * check if new name === old name
 * * check if new name not already existing
 * * update image and use same public id  and folder id
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
  const category = await Category.findOne({createdBy:_id,_id:categoryId});
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
  res
    .status(200)
    .json({ success: true, message: "Successfully updated" });
};
