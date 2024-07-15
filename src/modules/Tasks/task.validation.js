import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";



export const addTaskSchema = {
  body: Joi.object({
    title: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    status: Joi.string().valid("Public", "Private"),
  }),
  query: Joi.object({
    categoryId: generalRules.dbId,
  }),
}; 

export const updateTaskSchema = {
  body: Joi.object({
    title: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    status: Joi.string().valid("Public", "Private"),
  }),
  params: Joi.object({
    taskId: generalRules.dbId,
  }),
};

export const getTaskByIdSchema = {
  params: Joi.object({
    taskId: generalRules.dbId,
  }),
};
export const deleteTaskSchema = {
  params: Joi.object({
    taskId: generalRules.dbId,
  }),
};

