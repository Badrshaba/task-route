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


// delete task 

export const getAllTasks = async (req,res,next) =>{ // هنا في مشكله 
  const { _id } = req.authUser;
  const tasks = await Task.find({$or:[{createdBy:_id,status:"Private"},{status:"Public"}]})
    // * success response
    res.status(200).json({ success: true, message: "Successfully" , data:tasks });
}

export const getTask = async (req,res,next) =>{
  const { _id } = req.authUser;
  const {taskId} = req.params
  const task = await Task.findOne({_id:taskId,createdBy:_id})
  res.status(200).json({ success: true, message: "Successfully" , data:task });

}

export const deleteTask = async (req,res,next) =>{
  const { _id } = req.authUser;
  const {taskId} = req.params
const task = await Task.deleteOne({_id:taskId,createdBy:_id})
if (!task.deletedCount) {
  if (!task) return next(new Error(`Task not deleted`, { cause: 404 }));
}
res.status(200).json({ success: true, message: "Successfully deleted" });

}