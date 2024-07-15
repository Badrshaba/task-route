import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(20),
  }).required(),
};

export const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(20),
  }),
  params: Joi.object({ categoryId: generalRules.dbId }),
};
export const getCategorySchema = {
  params: Joi.object({ categoryId: generalRules.dbId }),
};
 