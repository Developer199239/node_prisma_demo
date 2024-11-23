import Joi from "joi";

export const validateExtension = (extension) => {
  const schema = Joi.string().pattern(/^\d+$/).required();
  return schema.validate(extension);
};
