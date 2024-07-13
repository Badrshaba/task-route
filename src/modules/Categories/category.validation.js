import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addCategorySchema = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(20),
  }).required(),
  headers: generalRules.headersRules,
};

export const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    oldPublicId: generalRules.dbId,
  }),
  params: Joi.object({ categoryId: generalRules.dbId }),
  headers: generalRules.headersRules,
};
