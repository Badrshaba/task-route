import Category from "../../../DB/models/Category.model.js";
import Task from "../../../DB/models/Task.model.js";



//================================ add task ================================//

/**
 * * detructure the required data from request body and request headers
 * * check in name is duplicated
 * * generate the task object
 * * create the task document
 * * response successfully created
 */
export const addTask = async (req, res, next) => {
    // * destructuring the data from the request body and authUser
    const { title  , status } = req.body;
    const { _id } = req.authUser;
    const {categoryId} = req.query
  
    // * check is category is found 
    const isCategoryFound = await Category.findById(categoryId);
    if (!isCategoryFound)
      return next(new Error("category not found", { cause: 400 }));
  
    // * generate the task object
    const taskDocument = {
        title,
        createdBy: _id,
        categoryId,
        status
    };
  console.log(taskDocument);
    // * create the category document
    const task = await Task.create(taskDocument);
    if(!task){
      return next(new Error("task isn't created", { cause: 400 }));
    }
    // * response successfully created
    res.status(201).json({
      success: true,
      message: "task created successfully",
    });
  };


