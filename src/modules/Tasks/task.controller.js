import Category from "../../../DB/models/Category.model.js";
import Task from "../../../DB/models/Task.model.js";
import { APIFeature } from "../../utils/api-features.js";

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
  const { title, status } = req.body;
  const { _id } = req.authUser;
  const { categoryId } = req.query;

  // * check is category is found
  const isCategoryFound = await Category.findById(categoryId);
  if (!isCategoryFound)
    return next(new Error("category not found", { cause: 400 }));

  // * generate the task object
  const taskDocument = {
    title,
    createdBy: _id,
    categoryId,
    status,
  };
  console.log(taskDocument);
  // * create the category document
  const task = await Task.create(taskDocument);
  if (!task) {
    return next(new Error("task isn't created", { cause: 400 }));
  }
  // * response successfully created
  res.status(201).json({
    success: true,
    message: "task created successfully",
  });
};

//================================ update task ================================//

/**
 * * detructure the required data from request body and request headers
 * * check in name is duplicated
 * * generate the task object
 * * create the task document
 * * response successfully created
 */
export const updateTask = async (req, res, next) => {
  const { title, status } = req.body;
  const { taskId } = req.params;

  // * check if category exists
  const task = await Task.findById(taskId);
  if (!task) return next(new Error(`Task not found`, { cause: 404 }));

  if (status) {
    task.status = status;
  }
  if (title) {
    task.title = title;
  }
  await task.save();

  // * success response
  res.status(200).json({ success: true, message: "Successfully updated" });
};

//================================ get task ================================//

/**
 * * detructure taskId params
 * * find task by taskId and createdBy
 * * response successfully
 */
export const getTask = async (req,res,next) =>{
  const { _id } = req.authUser;
// detructure taskId params
  const {taskId} = req.params
 // find task by taskId and createdBy
  const task = await Task.findOne({_id:taskId,createdBy:_id})
 // response successfully
  res.status(200).json({ success: true, message: "Successfully" , data:task });

}

//================================ delete task ================================//

/** 
 * * detructure taskId params
 * * delete task by taskId 
 * * check is task deleted
 * * response successfully
 */

export const deleteTask = async (req,res,next) =>{
  const { _id } = req.authUser;
 // detructure taskId params
  const {taskId} = req.params
 // delete task by taskId 
const task = await Task.deleteOne({_id:taskId,createdBy:_id})
// check is task deleted
if (!task.deletedCount) {
  if (!task) return next(new Error(`Task not deleted`, { cause: 404 }));
}
// response successfully
res.status(200).json({ success: true, message: "Successfully deleted" });

}
 
//=========================== get all Tasks with pagination ==========================//
/**
 * * destructuring the request query
 * * get all tasks
 * * success response
 */
export const getAllTasks = async (req, res, next) => {
  // * destructuring the request query
  const { page, size, sort, ...search } = req.query;

  // * get all tasks
  const features = new APIFeature(req.query, Task.find({ status: "Public" }))
    .pagination({
      page,
      size,
    })
    .sort(sort);

  const tasks = await features.mongooseQuery;

  // * success response
  res.status(200).json({ tasks });
}; 